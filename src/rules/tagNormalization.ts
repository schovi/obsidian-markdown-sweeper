import { RuleResult, RuleDefinition } from "./types";
import { processOutsideCode } from "./utils";

function normalizeTags(content: string): RuleResult {
	let changesCount = 0;

	// Match Obsidian tags: #tag or #parent/child
	// Don't match inside code blocks or inline code
	const result = processOutsideCode(content, (text) => {
		return text.replace(
			/(^|[\s,;:!?([{])#([a-zA-Z][a-zA-Z0-9_/-]*)/g,
			(match, prefix, tag) => {
				const lowercased = tag.toLowerCase();
				if (tag !== lowercased) {
					changesCount++;
					return `${prefix}#${lowercased}`;
				}
				return match;
			}
		);
	});

	return { content: result, changesCount };
}

export const tagNormalizationRule: RuleDefinition = {
	id: "tagNormalization",
	name: "Tag case",
	group: "obsidian",
	tier: "aggressive",
	example: "#Tag → #tag",
	fn: normalizeTags,
};
