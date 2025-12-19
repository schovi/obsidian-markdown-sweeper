export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Remove trailing whitespace from all lines
 */
export function removeTrailingWhitespace(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/[ \t]+$/gm, () => {
		changesCount++;
		return "";
	});

	return { content: result, changesCount };
}
