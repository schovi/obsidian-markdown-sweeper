import { RuleResult, RuleDefinition } from "./types";

function normalizeListMarkers(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/^(\s*)[*+](\s+)/gm, (match, indent, space) => {
		changesCount++;
		return `${indent}-${space}`;
	});

	return { content: result, changesCount };
}

export const listMarkersRule: RuleDefinition = {
	id: "listMarkers",
	name: "List markers",
	group: "lists",
	tier: "standard",
	example: "* item → - item",
	fn: normalizeListMarkers,
};
