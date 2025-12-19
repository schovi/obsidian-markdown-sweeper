export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Normalize markdown checkboxes
 * - [] → - [ ] (add space in empty checkbox)
 * - [X] → - [x] (lowercase x)
 */
export function normalizeCheckboxes(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	// Fix empty checkboxes without space: - [] → - [ ]
	result = result.replace(/^(\s*[-*+]\s*)\[\](\s)/gm, (match, prefix, suffix) => {
		changesCount++;
		return `${prefix}[ ]${suffix}`;
	});

	// Fix uppercase X: - [X] → - [x]
	result = result.replace(/^(\s*[-*+]\s*)\[X\]/gm, (match, prefix) => {
		changesCount++;
		return `${prefix}[x]`;
	});

	return { content: result, changesCount };
}
