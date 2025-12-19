export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Normalize smart/curly quotes to straight quotes
 */
export function normalizeSmartQuotes(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	// Double quotes: " " „ « » (using Unicode escapes for reliability)
	// \u201c = "  \u201d = "  \u201e = „  \u00ab = «  \u00bb = »
	result = result.replace(/[\u201c\u201d\u201e\u00ab\u00bb]/g, () => {
		changesCount++;
		return '"';
	});

	// Single quotes: ' ' ‚ ‹ ›
	// \u2018 = '  \u2019 = '  \u201a = ‚  \u2039 = ‹  \u203a = ›
	result = result.replace(/[\u2018\u2019\u201a\u2039\u203a]/g, () => {
		changesCount++;
		return "'";
	});

	return { content: result, changesCount };
}
