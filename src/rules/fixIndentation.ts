import { RuleResult, RuleDefinition } from "./types";

const LIST_ITEM_PATTERN = /^(\s*)([-*+]|\d+\.)\s/;
const INDENT_SIZE = 2;

function fixExcessiveIndentation(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	// Stack tracks: { original: number, fixed: number }
	// original = the indent as it appeared in source (for sibling detection)
	// fixed = the normalized indent (for parent/child calculation)
	const indentStack: Array<{ original: number; fixed: number }> = [];

	for (const line of lines) {
		const match = line.match(LIST_ITEM_PATTERN);

		if (!match) {
			result.push(line);
			continue;
		}

		const currentIndent = match[1].length;
		const restOfLine = line.slice(currentIndent);

		// Pop items that are at same or greater indent level (going back up the tree)
		while (indentStack.length > 0 && indentStack[indentStack.length - 1].original >= currentIndent) {
			indentStack.pop();
		}

		const parent = indentStack.length > 0 ? indentStack[indentStack.length - 1] : null;
		const parentFixedIndent = parent ? parent.fixed : -INDENT_SIZE;
		const expectedIndent = parentFixedIndent + INDENT_SIZE;

		if (currentIndent > expectedIndent) {
			// Excessive indentation - fix it
			changesCount++;
			result.push(" ".repeat(expectedIndent) + restOfLine);
			indentStack.push({ original: currentIndent, fixed: expectedIndent });
		} else {
			// Normal indentation
			result.push(line);
			indentStack.push({ original: currentIndent, fixed: currentIndent });
		}
	}

	return { content: result.join("\n"), changesCount };
}

export const fixIndentationRule: RuleDefinition = {
	id: "fixIndentation",
	name: "Broken indentation",
	group: "lists",
	tier: "standard",
	example: "········- item → ··- item",
	fn: fixExcessiveIndentation,
};
