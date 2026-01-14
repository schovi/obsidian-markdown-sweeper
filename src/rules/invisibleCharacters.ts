import { RuleResult, RuleDefinition } from "./types";

function cleanInvisibleCharacters(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	// Remove zero-width characters
	// U+200B zero-width space, U+200C zero-width non-joiner,
	// U+200D zero-width joiner, U+FEFF BOM/zero-width no-break space
	result = result.replace(/\u200B|\u200C|\u200D|\uFEFF/g, () => {
		changesCount++;
		return "";
	});

	// Convert non-breaking space (U+00A0) to regular space
	result = result.replace(/\u00A0/g, () => {
		changesCount++;
		return " ";
	});

	return { content: result, changesCount };
}

export const invisibleCharactersRule: RuleDefinition = {
	id: "invisibleCharacters",
	name: "Invisible characters",
	group: "whitespace",
	tier: "minimal",
	example: "te\u200Bxt → text",
	fn: cleanInvisibleCharacters,
};
