import { RuleResult, RuleDefinition } from "./types";

const LIST_ITEM_PATTERN = /^(\s*)([-*+]|\d+\.)\s/;
const INDENT_SIZE = 2;

function fixExcessiveIndentation(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	const indentStack: number[] = [];

	for (const line of lines) {
		const match = line.match(LIST_ITEM_PATTERN);

		if (!match) {
			result.push(line);
			continue;
		}

		const currentIndent = match[1].length;
		const restOfLine = line.slice(currentIndent);

		// Find the appropriate level in the stack
		while (indentStack.length > 0 && indentStack[indentStack.length - 1] >= currentIndent) {
			indentStack.pop();
		}

		const parentIndent = indentStack.length > 0 ? indentStack[indentStack.length - 1] : -INDENT_SIZE;
		const expectedIndent = parentIndent + INDENT_SIZE;

		if (currentIndent > expectedIndent) {
			// Excessive indentation - fix it
			changesCount++;
			result.push(" ".repeat(expectedIndent) + restOfLine);
			indentStack.push(expectedIndent);
		} else {
			// Normal indentation
			result.push(line);
			indentStack.push(currentIndent);
		}
	}

	return { content: result.join("\n"), changesCount };
}

export const fixIndentationRule: RuleDefinition = {
	id: "fixIndentation",
	name: "Broken indentation",
	group: "lists",
	example: "········- item → ··- item",
	fn: fixExcessiveIndentation,
};
