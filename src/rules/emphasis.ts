import { RuleResult, RuleDefinition } from "./types";
import { processOutsideCode } from "./utils";

function normalizeEmphasis(content: string): RuleResult {
	let changesCount = 0;

	// Process outside code blocks
	const result = processOutsideCode(content, (text) => {
		let processed = text;

		// Bold: __text__ → **text__ (don't match across lines)
		processed = processed.replace(/__([^_\n]+)__/g, (match, inner) => {
			changesCount++;
			return `**${inner}**`;
		});

		// Italic: _text_ → *text* (but not inside words like snake_case)
		// Only match _text_ at word boundaries, and skip if inner contains asterisks
		processed = processed.replace(
			/(^|[\s,;:!?([{])_([^_*\s][^_*]*[^_*\s])_([\s,;:!?)\]}]|$)/g,
			(match, before, inner, after) => {
				changesCount++;
				return `${before}*${inner}*${after}`;
			}
		);

		// Handle single character italic: _x_ (but not if it's an asterisk)
		processed = processed.replace(
			/(^|[\s,;:!?([{])_([^_*\s])_([\s,;:!?)\]}]|$)/g,
			(match, before, inner, after) => {
				changesCount++;
				return `${before}*${inner}*${after}`;
			}
		);

		return processed;
	});

	return { content: result, changesCount };
}

export const emphasisRule: RuleDefinition = {
	id: "emphasis",
	name: "Emphasis style",
	group: "formatting",
	tier: "aggressive",
	example: "_italic_ → *italic*",
	fn: normalizeEmphasis,
};
