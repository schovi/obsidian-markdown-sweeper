import { RuleResult, RuleDefinition } from "./types";

function normalizeListMarkers(content: string): RuleResult {
	let changesCount = 0;
	let result = content;

	// Normalize * and + to - (only when followed by space - avoids emphasis)
	result = result.replace(/^(\s*)[*+](\s+)/gm, (match, indent, space) => {
		changesCount++;
		return `${indent}-${space}`;
	});

	// Ensure space after - marker (handles -text → - text)
	// Exclude --- horizontal rules (use negative lookahead)
	result = result.replace(/^(\s*)-(?![-\s])(.)/gm, (match, indent, char) => {
		changesCount++;
		return `${indent}- ${char}`;
	});

	// Fix duplicate list markers (- - text → - text)
	result = result.replace(/^(\s*)-\s+(?:-\s+)+/gm, (match, indent) => {
		changesCount++;
		return `${indent}- `;
	});

	// Ensure space after numbered list marker (handles 1.text → 1. text)
	result = result.replace(/^(\s*)(\d+\.)(\S)/gm, (match, indent, num, char) => {
		changesCount++;
		return `${indent}${num} ${char}`;
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
