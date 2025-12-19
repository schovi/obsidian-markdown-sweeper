import { RuleResult, RuleDefinition } from "./types";

function removeTrailingWhitespaceContent(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/^(.*\S)([ \t]+)$/gm, (match, lineContent) => {
		changesCount++;
		return lineContent;
	});

	return { content: result, changesCount };
}

function removeTrailingWhitespaceBlank(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/^([ \t]+)$/gm, () => {
		changesCount++;
		return "";
	});

	return { content: result, changesCount };
}

export const trailingWhitespaceContentRule: RuleDefinition = {
	id: "trailingWhitespaceContent",
	name: "Trailing whitespace",
	group: "whitespace",
	example: "text·· → text",
	fn: removeTrailingWhitespaceContent,
};

export const trailingWhitespaceBlankRule: RuleDefinition = {
	id: "trailingWhitespaceBlank",
	name: "Blank line whitespace",
	group: "blankLines",
	example: "···(empty line) → (empty line)",
	fn: removeTrailingWhitespaceBlank,
};
