import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { applyAllRules } from "./rules";
import { CleanupModal } from "./CleanupModal";

export default class MarkdownCleanupPlugin extends Plugin {
	async onload() {
		// Add ribbon icon
		this.addRibbonIcon("eraser", "Cleanup Markdown", () => {
			this.runCleanup();
		});

		// Add command to palette
		this.addCommand({
			id: "cleanup-markdown",
			name: "Cleanup Markdown",
			editorCallback: (editor: Editor) => {
				this.runCleanupWithEditor(editor);
			},
		});
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
		const originalContent = editor.getValue();
		const { content: cleanedContent, summary } = applyAllRules(originalContent);

		new CleanupModal(this.app, originalContent, cleanedContent, summary, () => {
			editor.setValue(cleanedContent);
			new Notice("Markdown cleaned up!");
		}).open();
	}

	onunload() {
		// Cleanup if needed
	}
}
