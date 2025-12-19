import { RuleResult, RuleDefinition } from "./types";

function normalizeCheckboxes(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	result = result.replace(/^(\s*[-*+]\s*)\[\](\s)/gm, (match, prefix, suffix) => {
		changesCount++;
		return `${prefix}[ ]${suffix}`;
	});

	result = result.replace(/^(\s*[-*+]\s*)\[X\]/gm, (match, prefix) => {
		changesCount++;
		return `${prefix}[x]`;
	});

	return { content: result, changesCount };
}

export const checkboxesRule: RuleDefinition = {
	id: "checkboxes",
	name: "checkboxes",
	fn: normalizeCheckboxes,
};
