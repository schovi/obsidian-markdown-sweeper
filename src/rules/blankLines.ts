export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Remove blank lines between list items
 * Handles -, *, + markers with optional indentation
 */
export function removeBlankLinesBetweenListItems(content: string): RuleResult {
	let changesCount = 0;

	// Match list item followed by blank lines followed by another list item
	// Captures: (list item line)(blank lines)(next list marker)
	const result = content.replace(
		/^(\s*[-*+]\s+.*)(\n\s*\n)+(?=\s*[-*+]\s+)/gm,
		(match, listItem) => {
			changesCount++;
			return listItem + "\n";
		}
	);

	return { content: result, changesCount };
}

/**
 * Collapse multiple consecutive blank lines into a single blank line
 * Preserves single blank lines between paragraphs
 * Handles lines that contain only whitespace (spaces/tabs)
 */
export function collapseMultipleBlankLines(content: string): RuleResult {
	let changesCount = 0;

	// Match 2+ blank lines (including lines with only whitespace)
	// Pattern: newline + 2 or more occurrences of (optional whitespace + newline)
	const result = content.replace(/\n([ \t]*\n){2,}/g, (match) => {
		changesCount++;
		return "\n\n";
	});

	return { content: result, changesCount };
}
