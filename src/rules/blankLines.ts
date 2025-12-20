import { RuleResult, RuleDefinition } from "./types";

function removeBlankLinesBetweenListItems(content: string): RuleResult {
	let changesCount = 0;
	let result = content;

	// Remove blank lines between unordered list items
	result = result.replace(
		/^(\s*[-*+]\s+.*)(\n\s*\n)+(?=\s*[-*+]\s+)/gm,
		(match, listItem) => {
			changesCount++;
			return listItem + "\n";
		}
	);

	// Remove blank lines between ordered list items
	result = result.replace(
		/^(\s*\d+\.\s+.*)(\n\s*\n)+(?=\s*\d+\.\s+)/gm,
		(match, listItem) => {
			changesCount++;
			return listItem + "\n";
		}
	);

	return { content: result, changesCount };
}

function collapseMultipleBlankLines(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/\n([ \t]*\n){2,}/g, (match) => {
		changesCount++;
		return "\n\n";
	});

	return { content: result, changesCount };
}

export const blankLinesBetweenListItemsRule: RuleDefinition = {
	id: "blankLinesBetweenListItems",
	name: "Blank lines in lists",
	group: "blankLines",
	tier: "aggressive",
	example: "- item1\\n\\n- item2 → - item1\\n- item2",
	fn: removeBlankLinesBetweenListItems,
};

export const multipleBlankLinesRule: RuleDefinition = {
	id: "multipleBlankLines",
	name: "Extra blank lines",
	group: "blankLines",
	tier: "minimal",
	example: "3+ blank lines → 1 blank line",
	fn: collapseMultipleBlankLines,
};
