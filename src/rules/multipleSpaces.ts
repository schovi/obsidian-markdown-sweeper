import { RuleResult, RuleDefinition } from "./types";

function collapseMultipleSpaces(content: string): RuleResult {
	let changesCount = 0;

	const result = content
		.split("\n")
		.map((line) => {
			const leadingMatch = line.match(/^(\s*)/);
			const leading = leadingMatch ? leadingMatch[0] : "";
			const rest = line.slice(leading.length);

			const collapsed = rest.replace(/ {2,}/g, () => {
				changesCount++;
				return " ";
			});

			return leading + collapsed;
		})
		.join("\n");

	return { content: result, changesCount };
}

export const multipleSpacesRule: RuleDefinition = {
	id: "multipleSpaces",
	name: "Multiple spaces",
	group: "whitespace",
	example: "too····many → too many",
	fn: collapseMultipleSpaces,
};
