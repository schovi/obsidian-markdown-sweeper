export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Normalize list markers: convert * and + to -
 * Preserves indentation and spacing
 */
export function normalizeListMarkers(content: string): RuleResult {
	let changesCount = 0;

	// Match line start, optional whitespace, then * or + followed by space
	const result = content.replace(/^(\s*)[*+](\s+)/gm, (match, indent, space) => {
		changesCount++;
		return `${indent}-${space}`;
	});

	return { content: result, changesCount };
}
