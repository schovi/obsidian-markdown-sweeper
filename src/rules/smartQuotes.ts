import { RuleResult, RuleDefinition } from "./types";
import { processOutsideCode } from "./utils";

function normalizeSmartQuotes(content: string): RuleResult {
	let changesCount = 0;

	const result = processOutsideCode(content, (text) => {
		let processed = text;

		processed = processed.replace(/[\u201c\u201d\u201e\u00ab\u00bb]/g, () => {
			changesCount++;
			return '"';
		});

		processed = processed.replace(/[\u2018\u2019\u201a\u2039\u203a]/g, () => {
			changesCount++;
			return "'";
		});

		return processed;
	});

	return { content: result, changesCount };
}

export const smartQuotesRule: RuleDefinition = {
	id: "smartQuotes",
	name: "Smart quotes",
	group: "formatting",
	tier: "aggressive",
	example: '"curly" → "straight"',
	fn: normalizeSmartQuotes,
};
