import { App, Modal } from "obsidian";
import { diffLines, diffChars, Change } from "diff";
import { CleanupSummary, formatSummary } from "./rules";

interface LinePair {
	type: "unchanged" | "removed" | "added" | "modified";
	oldLine?: string;
	newLine?: string;
}

interface CleanupModalOptions {
	isPartial?: boolean;
}

export class CleanupModal extends Modal {
	private originalContent: string;
	private cleanedContent: string;
	private summary: CleanupSummary;
	private onApply: () => void;
	private options: CleanupModalOptions;

	constructor(
		app: App,
		originalContent: string,
		cleanedContent: string,
		summary: CleanupSummary,
		onApply: () => void,
		options: CleanupModalOptions = {}
	) {
		super(app);
		this.originalContent = originalContent;
		this.cleanedContent = cleanedContent;
		this.summary = summary;
		this.onApply = onApply;
		this.options = options;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("md-cleanup-modal");

		// Header with summary
		const header = contentEl.createDiv({ cls: "md-cleanup-header" });
		header.createEl("h2", { text: "Markdown Cleanup Preview" });

		const summaryText = formatSummary(this.summary);
		header.createEl("p", {
			text: summaryText,
			cls: this.summary.totalChanges > 0 ? "md-cleanup-summary" : "md-cleanup-no-changes",
		});

		// Diff container
		const diffContainer = contentEl.createDiv({ cls: "md-cleanup-diff-container" });

		if (this.summary.totalChanges === 0) {
			diffContainer.createEl("p", {
				text: "Your document is already clean!",
				cls: "md-cleanup-no-changes-message",
			});
		} else {
			this.renderUnifiedDiff(diffContainer);
		}

		// Buttons
		const buttonContainer = contentEl.createDiv({ cls: "md-cleanup-buttons" });

		if (this.summary.totalChanges > 0) {
			const applyBtn = buttonContainer.createEl("button", {
				text: "Apply Changes",
				cls: "mod-cta",
			});
			applyBtn.addEventListener("click", () => {
				this.onApply();
				this.close();
			});
		}

		const cancelBtn = buttonContainer.createEl("button", {
			text: this.summary.totalChanges > 0 ? "Cancel" : "Close",
		});
		cancelBtn.addEventListener("click", () => this.close());
	}

	private renderUnifiedDiff(container: HTMLElement) {
		const linePairs = this.computeLinePairs();
		const diffEl = container.createDiv({ cls: "md-cleanup-diff" });

		if (this.options.isPartial) {
			this.renderEllipsis(diffEl);
		}

		for (const pair of linePairs) {
			if (pair.type === "unchanged") {
				this.renderUnchangedLine(diffEl, pair.oldLine || "");
			} else if (pair.type === "modified") {
				this.renderModifiedPair(diffEl, pair.oldLine || "", pair.newLine || "");
			} else if (pair.type === "removed") {
				this.renderRemovedLine(diffEl, pair.oldLine || "");
			} else if (pair.type === "added") {
				this.renderAddedLine(diffEl, pair.newLine || "");
			}
		}

		if (this.options.isPartial) {
			this.renderEllipsis(diffEl);
		}
	}

	private renderEllipsis(container: HTMLElement) {
		const lineEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-ellipsis" });
		lineEl.createSpan({ text: "  ", cls: "md-cleanup-prefix" });
		lineEl.createSpan({ text: "...", cls: "md-cleanup-ellipsis" });
	}

	private computeLinePairs(): LinePair[] {
		const diff = diffLines(this.originalContent, this.cleanedContent);
		const pairs: LinePair[] = [];

		let i = 0;
		while (i < diff.length) {
			const part = diff[i];

			if (!part.added && !part.removed) {
				const lines = this.splitLines(part.value);
				for (const line of lines) {
					pairs.push({ type: "unchanged", oldLine: line });
				}
				i++;
			} else if (part.removed) {
				const removedLines = this.splitLines(part.value);
				const nextPart = diff[i + 1];

				if (nextPart && nextPart.added) {
					const addedLines = this.splitLines(nextPart.value);
					this.matchAndPairLines(removedLines, addedLines, pairs);
					i += 2;
				} else {
					for (const line of removedLines) {
						pairs.push({ type: "removed", oldLine: line });
					}
					i++;
				}
			} else if (part.added) {
				const addedLines = this.splitLines(part.value);
				for (const line of addedLines) {
					pairs.push({ type: "added", newLine: line });
				}
				i++;
			}
		}

		return pairs;
	}

	private matchAndPairLines(
		removedLines: string[],
		addedLines: string[],
		pairs: LinePair[]
	): void {
		const addedUsed = new Set<number>();

		for (const oldLine of removedLines) {
			const oldTrimmed = oldLine.trim();

			// Find best match: exact content match (whitespace-only change)
			let matchIdx = -1;
			for (let j = 0; j < addedLines.length; j++) {
				if (addedUsed.has(j)) continue;
				if (addedLines[j].trim() === oldTrimmed) {
					matchIdx = j;
					break;
				}
			}

			if (matchIdx !== -1) {
				const newLine = addedLines[matchIdx];
				addedUsed.add(matchIdx);

				if (oldLine === newLine) {
					pairs.push({ type: "unchanged", oldLine });
				} else {
					pairs.push({ type: "modified", oldLine, newLine });
				}
			} else if (oldTrimmed === "") {
				pairs.push({ type: "removed", oldLine });
			} else {
				// Try fuzzy match - find most similar unused line
				let bestIdx = -1;
				let bestScore = 0;
				for (let j = 0; j < addedLines.length; j++) {
					if (addedUsed.has(j)) continue;
					const score = this.similarity(oldTrimmed, addedLines[j].trim());
					if (score > bestScore && score > 0.5) {
						bestScore = score;
						bestIdx = j;
					}
				}

				if (bestIdx !== -1) {
					addedUsed.add(bestIdx);
					pairs.push({ type: "modified", oldLine, newLine: addedLines[bestIdx] });
				} else {
					pairs.push({ type: "removed", oldLine });
				}
			}
		}

		// Add any unmatched added lines
		for (let j = 0; j < addedLines.length; j++) {
			if (!addedUsed.has(j)) {
				pairs.push({ type: "added", newLine: addedLines[j] });
			}
		}
	}

	private similarity(a: string, b: string): number {
		if (a === b) return 1;
		if (a.length === 0 || b.length === 0) return 0;

		// Simple similarity: ratio of common characters
		const setA = new Set(a);
		const setB = new Set(b);
		let common = 0;
		for (const c of setA) {
			if (setB.has(c)) common++;
		}
		return (2 * common) / (setA.size + setB.size);
	}

	private splitLines(text: string): string[] {
		const lines = text.split("\n");
		// Remove trailing empty string from split
		if (lines.length > 0 && lines[lines.length - 1] === "") {
			lines.pop();
		}
		return lines;
	}

	private renderUnchangedLine(container: HTMLElement, line: string) {
		const lineEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-unchanged" });
		lineEl.createSpan({ text: "  ", cls: "md-cleanup-prefix" });
		lineEl.createSpan({ text: line || " " });
	}

	private renderRemovedLine(container: HTMLElement, line: string) {
		const lineEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-removed" });
		lineEl.createSpan({ text: "- ", cls: "md-cleanup-prefix" });

		// Check if this is a blank line (empty or whitespace-only)
		if (line.trim() === "") {
			if (line.length > 0) {
				this.renderVisibleWhitespace(lineEl, line, "md-cleanup-char-removed");
			}
			lineEl.createSpan({ text: " ← removed", cls: "md-cleanup-blank-label" });
		} else {
			this.renderLineWithWhitespace(lineEl, line, true);
		}
	}

	private renderAddedLine(container: HTMLElement, line: string) {
		const lineEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-added" });
		lineEl.createSpan({ text: "+ ", cls: "md-cleanup-prefix" });
		this.renderLineWithWhitespace(lineEl, line, false);
	}

	private renderModifiedPair(container: HTMLElement, oldLine: string, newLine: string) {
		// Check if this is whitespace-only change
		if (this.isWhitespaceOnlyChange(oldLine, newLine)) {
			// Show single line with whitespace indicator
			this.renderWhitespaceOnlyChange(container, oldLine, newLine);
			return;
		}

		// Render the removed line with character highlighting
		const removedEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-removed" });
		removedEl.createSpan({ text: "- ", cls: "md-cleanup-prefix" });
		this.renderCharDiff(removedEl, oldLine, newLine, true);

		// Render the added line with character highlighting
		const addedEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-added" });
		addedEl.createSpan({ text: "+ ", cls: "md-cleanup-prefix" });
		this.renderCharDiff(addedEl, oldLine, newLine, false);
	}

	private renderWhitespaceOnlyChange(container: HTMLElement, oldLine: string, newLine: string) {
		const lineEl = container.createDiv({ cls: "md-cleanup-line md-cleanup-line-whitespace" });
		lineEl.createSpan({ text: "  ", cls: "md-cleanup-prefix" });

		// Detect leading and trailing whitespace changes
		const oldLeading = oldLine.match(/^[ \t]*/)?.[0] || "";
		const newLeading = newLine.match(/^[ \t]*/)?.[0] || "";
		const oldTrailing = oldLine.match(/[ \t]*$/)?.[0] || "";
		const newTrailing = newLine.match(/[ \t]*$/)?.[0] || "";

		const removedLeading = oldLeading.slice(newLeading.length);
		const removedTrailing = oldTrailing.slice(newTrailing.length);

		if (newLine === "" && (removedLeading || removedTrailing)) {
			// Blank line that had only whitespace
			this.renderVisibleWhitespace(lineEl, oldLine, "md-cleanup-ws-removed");
			lineEl.createSpan({
				text: ` ← blank lines (${this.summary.results.get("trailingWhitespaceBlank") || 0})`,
				cls: "md-cleanup-blank-label"
			});
		} else {
			// Show removed leading whitespace
			if (removedLeading) {
				this.renderVisibleWhitespace(lineEl, removedLeading, "md-cleanup-ws-removed");
			}

			// Show the actual content
			lineEl.createSpan({ text: newLine.trim() });

			// Show removed trailing whitespace
			if (removedTrailing) {
				this.renderVisibleWhitespace(lineEl, removedTrailing, "md-cleanup-ws-removed");
			}
		}
	}

	private renderCharDiff(container: HTMLElement, oldLine: string, newLine: string, showOld: boolean) {
		const charDiff = diffChars(oldLine, newLine);

		// Check if this is a whitespace-only change
		const isWhitespaceOnly = this.isWhitespaceOnlyChange(oldLine, newLine);

		for (const part of charDiff) {
			if (showOld) {
				// Rendering the old (removed) line
				if (part.removed) {
					// This text was removed - highlight it
					if (isWhitespaceOnly && /^\s+$/.test(part.value)) {
						this.renderVisibleWhitespace(container, part.value, "md-cleanup-char-removed");
					} else {
						container.createSpan({
							text: part.value,
							cls: "md-cleanup-char-removed",
						});
					}
				} else if (!part.added) {
					// Unchanged text
					container.createSpan({ text: part.value });
				}
			} else {
				// Rendering the new (added) line
				if (part.added) {
					// This text was added - highlight it
					container.createSpan({
						text: part.value,
						cls: "md-cleanup-char-added",
					});
				} else if (!part.removed) {
					// Unchanged text
					container.createSpan({ text: part.value });
				}
			}
		}

		// Handle empty line display
		if ((showOld && oldLine === "") || (!showOld && newLine === "")) {
			container.createSpan({ text: "(empty line)", cls: "md-cleanup-empty-line" });
		}
	}

	private isWhitespaceOnlyChange(oldLine: string, newLine: string): boolean {
		return oldLine.trim() === newLine.trim();
	}

	private renderLineWithWhitespace(container: HTMLElement, line: string, highlightTrailing: boolean) {
		if (line === "") {
			container.createSpan({ text: "(empty line)", cls: "md-cleanup-empty-line" });
			return;
		}

		if (highlightTrailing) {
			// Find trailing whitespace
			const match = line.match(/^(.*?)(\s+)$/);
			if (match) {
				container.createSpan({ text: match[1] });
				this.renderVisibleWhitespace(container, match[2], "md-cleanup-char-removed");
				return;
			}
		}

		container.createSpan({ text: line });
	}

	private renderVisibleWhitespace(container: HTMLElement, whitespace: string, cls: string) {
		// Convert whitespace to visible characters
		let visible = "";
		for (const char of whitespace) {
			if (char === " ") {
				visible += "·";
			} else if (char === "\t") {
				visible += "→   ";
			} else {
				visible += char;
			}
		}
		container.createSpan({ text: visible, cls: cls + " md-cleanup-whitespace" });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
