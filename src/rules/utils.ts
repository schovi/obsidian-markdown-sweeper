/**
 * Process content outside of code blocks (fenced and inline).
 * Useful for rules that should not modify code examples.
 */
export function processOutsideCode(
	content: string,
	processor: (text: string) => string
): string {
	const parts: string[] = [];

	const codePattern = /(```[\s\S]*?```|`[^`\n]+`)/g;
	let lastIndex = 0;
	let match;

	while ((match = codePattern.exec(content)) !== null) {
		if (match.index > lastIndex) {
			parts.push(processor(content.slice(lastIndex, match.index)));
		}
		parts.push(match[0]);
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < content.length) {
		parts.push(processor(content.slice(lastIndex)));
	}

	return parts.join("");
}

/**
 * Escape special regex characters in a string.
 */
export function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
