import { RuleResult, RuleDefinition } from "./types";

function convertLeadingTabsToSpaces(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/^(\t+)/gm, (match) => {
		changesCount++;
		return "  ".repeat(match.length);
	});

	return { content: result, changesCount };
}

export const tabsToSpacesRule: RuleDefinition = {
	id: "tabsToSpaces",
	name: "Tabs to spaces",
	example: "→item → ··item",
	fn: convertLeadingTabsToSpaces,
};
