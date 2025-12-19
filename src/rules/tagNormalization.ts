import { RuleResult, RuleDefinition } from "./types";

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

function processOutsideCode(
	content: string,
	processor: (text: string) => string
): string {
	const parts: string[] = [];

	// Match code blocks and inline code
	const codePattern = /(```[\s\S]*?```|`[^`\n]+`)/g;
	let lastIndex = 0;
	let match;

	while ((match = codePattern.exec(content)) !== null) {
		if (match.index > lastIndex) {
			parts.push(processor(content.slice(lastIndex, match.index)));
		}
		parts.push(match[0]);
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < content.length) {
		parts.push(processor(content.slice(lastIndex)));
	}

	return parts.join("");
}

export const tagNormalizationRule: RuleDefinition = {
	id: "tagNormalization",
	name: "Tag case",
	group: "obsidian",
	example: "#Tag → #tag",
	fn: normalizeTags,
};
