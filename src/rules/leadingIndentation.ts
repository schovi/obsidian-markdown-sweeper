import { RuleResult, RuleDefinition } from "./types";

function removeCommonLeadingIndentation(content: string): RuleResult {
	const lines = content.split("\n");

	let minIndent = Infinity;
	for (const line of lines) {
		if (line.trim() === "") continue;

		const match = line.match(/^[ \t]*/);
		const indent = match ? match[0].length : 0;
		minIndent = Math.min(minIndent, indent);
	}

	if (minIndent === 0 || minIndent === Infinity) {
		return { content, changesCount: 0 };
	}

	const result = lines
		.map((line) => {
			if (line.trim() === "") return line;
			return line.slice(minIndent);
		})
		.join("\n");

	return { content: result, changesCount: minIndent };
}

export const leadingIndentationRule: RuleDefinition = {
	id: "leadingIndentation",
	name: "common indentation",
	fn: removeCommonLeadingIndentation,
};
