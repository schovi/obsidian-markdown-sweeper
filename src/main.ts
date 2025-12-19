import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { applyAllRules } from "./rules";
import { CleanupModal } from "./CleanupModal";
import {
	MarkdownCleanupSettings,
	MarkdownCleanupSettingsTab,
	getDefaultSettings,
} from "./settings";

export default class MarkdownCleanupPlugin extends Plugin {
	settings: MarkdownCleanupSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new MarkdownCleanupSettingsTab(this.app, this));

		this.addRibbonIcon("eraser", "Cleanup Markdown", () => {
			this.runCleanup();
		});

		this.addCommand({
			id: "cleanup-markdown",
			name: "Cleanup Markdown",
			editorCallback: (editor: Editor) => {
				this.runCleanupWithEditor(editor);
			},
		});
	}

	async loadSettings() {
		this.settings = Object.assign(getDefaultSettings(), await this.loadData());
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
		const originalContent = editor.getValue();
		const { content: cleanedContent, summary } = applyAllRules(
			originalContent,
			this.settings.enabledRules
		);

		new CleanupModal(this.app, originalContent, cleanedContent, summary, () => {
			editor.setValue(cleanedContent);
			new Notice("Markdown cleaned up!");
		}).open();
	}

	private runCleanupOnSelection(editor: Editor, selection: string) {
		const { content: cleanedContent, summary } = applyAllRules(
			selection,
			this.settings.enabledRules
		);

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

	onunload() {}
}
