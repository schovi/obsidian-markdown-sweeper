import { RuleResult, RuleDefinition } from "./types";

function renumberOrderedLists(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	// Track numbering per indent level
	const counters: Map<number, number> = new Map();
	let lastIndent = -1;

	for (const line of lines) {
		const match = line.match(/^(\s*)(\d+)(\.)\s/);

		if (!match) {
			// Not an ordered list item - reset counters for non-list content
			if (line.trim() !== "" && !line.match(/^\s*[-*+]\s/)) {
				counters.clear();
				lastIndent = -1;
			}
			result.push(line);
			continue;
		}

		const [, indent, currentNum, dot] = match;
		const indentLevel = indent.length;

		// Reset counters for deeper levels when we go back up
		if (indentLevel < lastIndent) {
			for (const [level] of counters) {
				if (level > indentLevel) {
					counters.delete(level);
				}
			}
		}

		// Get or initialize counter for this level
		let counter = counters.get(indentLevel) || 0;
		counter++;
		counters.set(indentLevel, counter);
		lastIndent = indentLevel;

		const expectedNum = counter.toString();
		if (currentNum !== expectedNum) {
			changesCount++;
			const rest = line.slice(match[0].length);
			result.push(`${indent}${expectedNum}. ${rest}`);
		} else {
			result.push(line);
		}
	}

	return { content: result.join("\n"), changesCount };
}

export const orderedListsRule: RuleDefinition = {
	id: "orderedLists",
	name: "Ordered list numbers",
	group: "lists",
	tier: "standard",
	example: "1. 1. 1. → 1. 2. 3.",
	fn: renumberOrderedLists,
};
