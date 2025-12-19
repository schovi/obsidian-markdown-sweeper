export interface TrailingWhitespaceResult {
	content: string;
	contentLinesCount: number;
	blankLinesCount: number;
}

/**
 * Remove trailing whitespace from all lines
 * Tracks content lines vs blank lines separately
 */
export function removeTrailingWhitespace(content: string): TrailingWhitespaceResult {
	let contentLinesCount = 0;
	let blankLinesCount = 0;

	const result = content.replace(/^(.*?)([ \t]+)$/gm, (match, content, whitespace) => {
		if (content === "") {
			blankLinesCount++;
		} else {
			contentLinesCount++;
		}
		return content;
	});

	return { content: result, contentLinesCount, blankLinesCount };
}
