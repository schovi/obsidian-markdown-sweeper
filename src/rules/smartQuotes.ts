import { RuleResult, RuleDefinition } from "./types";

function normalizeSmartQuotes(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	result = result.replace(/[\u201c\u201d\u201e\u00ab\u00bb]/g, () => {
		changesCount++;
		return '"';
	});

	result = result.replace(/[\u2018\u2019\u201a\u2039\u203a]/g, () => {
		changesCount++;
		return "'";
	});

	return { content: result, changesCount };
}

export const smartQuotesRule: RuleDefinition = {
	id: "smartQuotes",
	name: "Smart quotes",
	group: "formatting",
	example: '"curly" → "straight"',
	fn: normalizeSmartQuotes,
};
