export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Collapse multiple consecutive spaces to single space
 * Preserves leading indentation
 */
export function collapseMultipleSpaces(content: string): RuleResult {
	let changesCount = 0;

	const result = content
		.split("\n")
		.map((line) => {
			// Preserve leading whitespace
			const leadingMatch = line.match(/^(\s*)/);
			const leading = leadingMatch ? leadingMatch[0] : "";
			const rest = line.slice(leading.length);

			// Collapse multiple spaces in the rest of the line
			const collapsed = rest.replace(/ {2,}/g, () => {
				changesCount++;
				return " ";
			});

			return leading + collapsed;
		})
		.join("\n");

	return { content: result, changesCount };
}
