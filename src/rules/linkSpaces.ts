import { RuleResult, RuleDefinition } from "./types";

function fixLinkSpaces(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(
		/\[([^\]]+)\]\s+\(([^)]+)\)/g,
		(match, text, url) => {
			changesCount++;
			return `[${text}](${url})`;
		}
	);

	return { content: result, changesCount };
}

export const linkSpacesRule: RuleDefinition = {
	id: "linkSpaces",
	name: "Link spaces",
	group: "formatting",
	tier: "standard",
	example: "[text] (url) → [text](url)",
	fn: fixLinkSpaces,
};
