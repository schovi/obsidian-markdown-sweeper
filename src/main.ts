import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { applyAllRules } from "./rules";
import { CleanupModal } from "./CleanupModal";
import {
	SweeperSettings,
	SweeperSettingsTab,
	getDefaultSettings,
	migrateSettings,
} from "./settings";

declare module "obsidian" {
	interface App {
		commands?: {
			commands?: Record<
				string,
				{ checkCallback?: (checking: boolean) => boolean }
			>;
		};
	}
}

export default class SweeperPlugin extends Plugin {
	settings: SweeperSettings;
	private originalCheckCallback: ((checking: boolean) => boolean) | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SweeperSettingsTab(this.app, this));

		this.addRibbonIcon("eraser", "Clean Markdown", () => {
			this.runCleanup();
		});

		this.addCommand({
			id: "cleanup-markdown",
			name: "Clean Markdown",
			editorCallback: (editor: Editor) => {
				this.runCleanupWithEditor(editor);
			},
		});

		this.addCommand({
			id: "quick-cleanup",
			name: "Quick cleanup (no preview)",
			editorCallback: (editor: Editor) => {
				this.runQuickCleanup(editor);
			},
		});

		this.addCommand({
			id: "paste-and-clean",
			name: "Paste and clean",
			editorCallback: (editor: Editor) => {
				void this.pasteAndClean(editor);
			},
		});

		this.registerEvent(
			this.app.workspace.on("editor-paste", this.handlePaste.bind(this))
		);

		// Defer hook setup - commands may not be loaded yet
		this.app.workspace.onLayoutReady(() => {
			this.hookSaveCommand();
		});
	}

	private hookSaveCommand() {
		const commands = this.app.commands?.commands;
		const saveCommand = commands?.["editor:save-file"];

		if (saveCommand?.checkCallback) {
			this.originalCheckCallback = saveCommand.checkCallback;
			saveCommand.checkCallback = (checking: boolean) => {
				if (checking) {
					return this.originalCheckCallback!(checking);
				}
				this.cleanOnSave(() => this.originalCheckCallback!(false));
				return true;
			};
		}
	}

	private cleanOnSave(originalSave: () => void) {
		if (this.settings.cleanOnSaveMode === "off") {
			originalSave();
			return;
		}

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view || view.file?.extension !== "md") {
			originalSave();
			return;
		}

		const editor = view.editor;
		const content = editor.getValue();
		const { content: cleaned, summary } = applyAllRules(content, this.settings.enabledRules);

		if (summary.totalChanges === 0) {
			originalSave();
			return;
		}

		if (this.settings.cleanOnSaveMode === "quick") {
			editor.setValue(cleaned);
			originalSave();
			new Notice(`Cleaned ${summary.totalChanges} items`);
			return;
		}

		new CleanupModal(
			this.app,
			content,
			cleaned,
			summary,
			() => {
				editor.setValue(cleaned);
				originalSave();
				new Notice(`Cleaned ${summary.totalChanges} items`);
			},
			{
				mode: "save",
				onKeepOriginal: () => {
					originalSave();
				},
			}
		).open();
	}

	async loadSettings() {
		const data = await this.loadData() || {};
		migrateSettings(data);
		this.settings = Object.assign(getDefaultSettings(), data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private runCleanup() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			new Notice("No active markdown file");
			return;
		}

		const editor = view.editor;
		this.runCleanupWithEditor(editor);
	}

	private runCleanupWithEditor(editor: Editor) {
		const selection = editor.getSelection();

		if (selection) {
			this.runCleanupOnSelection(editor, selection);
		} else {
			this.runCleanupOnDocument(editor);
		}
	}

	private runCleanupOnDocument(editor: Editor) {
		const loadingNotice = new Notice("Preparing cleanup...", 0);
		const originalContent = editor.getValue();
		const { content: cleanedContent, summary } = applyAllRules(
			originalContent,
			this.settings.enabledRules
		);
		loadingNotice.hide();

		new CleanupModal(this.app, originalContent, cleanedContent, summary, () => {
			editor.setValue(cleanedContent);
			new Notice("Markdown cleaned up!");
		}).open();
	}

	private runCleanupOnSelection(editor: Editor, selection: string) {
		const loadingNotice = new Notice("Preparing cleanup...", 0);
		const { content: cleanedContent, summary } = applyAllRules(
			selection,
			this.settings.enabledRules
		);
		loadingNotice.hide();

		new CleanupModal(
			this.app,
			selection,
			cleanedContent,
			summary,
			() => {
				editor.replaceSelection(cleanedContent);
				new Notice("Selection cleaned up!");
			},
			{ isPartial: true }
		).open();
	}

	private runQuickCleanup(editor: Editor) {
		const loadingNotice = new Notice("Preparing cleanup...", 0);
		const selection = editor.getSelection();

		if (selection) {
			const { content: cleaned, summary } = applyAllRules(selection, this.settings.enabledRules);
			loadingNotice.hide();
			if (summary.totalChanges > 0) {
				editor.replaceSelection(cleaned);
				new Notice(`Cleaned ${summary.totalChanges} items in selection`);
			} else {
				new Notice("Selection already clean");
			}
		} else {
			const content = editor.getValue();
			const { content: cleaned, summary } = applyAllRules(content, this.settings.enabledRules);
			loadingNotice.hide();
			if (summary.totalChanges > 0) {
				editor.setValue(cleaned);
				new Notice(`Cleaned ${summary.totalChanges} items`);
			} else {
				new Notice("Document already clean");
			}
		}
	}

	private async pasteAndClean(editor: Editor) {
		try {
			const clipboard = await navigator.clipboard.readText();
			if (!clipboard) {
				new Notice("Clipboard is empty");
				return;
			}

			const loadingNotice = new Notice("Preparing cleanup...", 0);
			const { content: cleaned, summary } = applyAllRules(clipboard, this.settings.enabledRules);
			loadingNotice.hide();
			editor.replaceSelection(cleaned);

			if (summary.totalChanges > 0) {
				new Notice(`Pasted and cleaned ${summary.totalChanges} items`);
			} else {
				new Notice("Pasted (no cleanup needed)");
			}
		} catch {
			new Notice("Failed to read clipboard");
		}
	}

	private handlePaste(evt: ClipboardEvent, editor: Editor) {
		if (this.settings.cleanOnPasteMode === "off") return;

		// Let Obsidian handle HTML content natively (HTML-to-MD conversion)
		if (evt.clipboardData?.types.includes("text/html")) return;

		const original = evt.clipboardData?.getData("text/plain");
		if (!original) return;

		evt.preventDefault();

		const loadingNotice = new Notice("Preparing cleanup...", 0);

		const { content: cleaned, summary } = applyAllRules(original, this.settings.enabledRules);

		loadingNotice.hide();

		if (summary.totalChanges === 0) {
			editor.replaceSelection(original);
			return;
		}

		if (this.settings.cleanOnPasteMode === "quick") {
			editor.replaceSelection(cleaned);
			new Notice(`Pasted with ${summary.totalChanges} cleanups`);
			return;
		}

		new CleanupModal(
			this.app,
			original,
			cleaned,
			summary,
			() => {
				editor.replaceSelection(cleaned);
				new Notice(`Pasted with ${summary.totalChanges} cleanups`);
			},
			{
				mode: "paste",
				onKeepOriginal: () => {
					editor.replaceSelection(original);
				},
			}
		).open();
	}

	onunload() {
		if (this.originalCheckCallback) {
			const commands = this.app.commands?.commands;
			const saveCommand = commands?.["editor:save-file"];
			if (saveCommand) {
				saveCommand.checkCallback = this.originalCheckCallback;
			}
		}
	}
}
