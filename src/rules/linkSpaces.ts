export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Fix spaces in markdown links
 * [text] (url) → [text](url)
 */
export function fixLinkSpaces(content: string): RuleResult {
	let changesCount = 0;

	// Match [text] (url) with space before parenthesis
	const result = content.replace(
		/\[([^\]]+)\]\s+\(([^)]+)\)/g,
		(match, text, url) => {
			changesCount++;
			return `[${text}](${url})`;
		}
	);

	return { content: result, changesCount };
}
