import { RuleResult, RuleDefinition } from "./types";

function cleanupBlockQuotes(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/^(>+)(.*)$/gm, (match, markers, rest) => {
		// Normalize markers: add space between each >
		const normalizedMarkers = markers.split("").join(" ");

		// Ensure single space after last >
		const trimmedRest = rest.replace(/^[ \t]*/, "");
		const normalizedLine =
			trimmedRest.length > 0
				? `${normalizedMarkers} ${trimmedRest}`
				: normalizedMarkers;

		if (match !== normalizedLine) {
			changesCount++;
			return normalizedLine;
		}
		return match;
	});

	return { content: result, changesCount };
}

export const blockQuotesRule: RuleDefinition = {
	id: "blockQuotes",
	name: "Block quotes",
	group: "blockElements",
	example: ">text → > text",
	fn: cleanupBlockQuotes,
};
