import { RuleResult, RuleDefinition } from "./types";

function normalizeEmphasis(content: string): RuleResult {
	let changesCount = 0;

	// Process outside code blocks
	const result = processOutsideCode(content, (text) => {
		let processed = text;

		// Bold: __text__ → **text**
		processed = processed.replace(/__([^_]+)__/g, (match, inner) => {
			changesCount++;
			return `**${inner}**`;
		});

		// Italic: _text_ → *text* (but not inside words like snake_case)
		// Only match _text_ at word boundaries
		processed = processed.replace(
			/(^|[\s,;:!?([{])_([^_\s][^_]*[^_\s])_([\s,;:!?)\]}]|$)/g,
			(match, before, inner, after) => {
				changesCount++;
				return `${before}*${inner}*${after}`;
			}
		);

		// Handle single character italic: _x_
		processed = processed.replace(
			/(^|[\s,;:!?([{])_([^_\s])_([\s,;:!?)\]}]|$)/g,
			(match, before, inner, after) => {
				changesCount++;
				return `${before}*${inner}*${after}`;
			}
		);

		return processed;
	});

	return { content: result, changesCount };
}

function processOutsideCode(
	content: string,
	processor: (text: string) => string
): string {
	const parts: string[] = [];

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

export const emphasisRule: RuleDefinition = {
	id: "emphasis",
	name: "Emphasis style",
	group: "formatting",
	example: "_italic_ → *italic*",
	fn: normalizeEmphasis,
};
