import { RuleResult, RuleDefinition } from "./types";

function convertNumberedHeaders(content: string): RuleResult {
	let changesCount = 0;

	// Match headers with em dash separator:
	// - Arabic numerals: 1, 1.1, 1.1.1
	// - Roman numerals: I, II, III, IV, I.1, I.1.1
	// - Letters: A, B, C, A.1, A.1.1
	const pattern =
		/^(\d+(?:\.\d+)*|[IVXLCDM]+(?:\.\d+)*|[A-Z](?:\.\d+)*)\s*—\s*(.+)$/gm;

	const result = content.replace(pattern, (match, number, title) => {
		changesCount++;
		const depth = (number.match(/\./g) || []).length;
		const headerLevel = "#".repeat(depth + 2);
		return `${headerLevel} ${number}. ${title}`;
	});

	return { content: result, changesCount };
}

export const numberedHeadersRule: RuleDefinition = {
	id: "numberedHeaders",
	name: "Numbered headers",
	group: "headings",
	tier: "aggressive",
	example: "1 — Title → ## 1. Title",
	fn: convertNumberedHeaders,
};
