import { RuleResult, RuleDefinition } from "./types";

function removeLineLeadingWhitespace(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	let inCodeBlock = false;

	for (const line of lines) {
		// Track code blocks
		if (line.trim().startsWith("```")) {
			inCodeBlock = !inCodeBlock;
			result.push(line);
			continue;
		}

		// Don't modify inside code blocks
		if (inCodeBlock) {
			result.push(line);
			continue;
		}

		// Don't modify lines that are intentionally indented:
		// - List items (including continuations)
		// - Blockquotes
		// - Empty lines
		const trimmed = line.trimStart();
		if (
			trimmed === "" ||
			trimmed.startsWith("-") ||
			trimmed.startsWith("*") ||
			trimmed.startsWith("+") ||
			trimmed.startsWith(">") ||
			/^\d+\./.test(trimmed)
		) {
			result.push(line);
			continue;
		}

		// Remove leading whitespace from regular paragraph lines
		if (line !== trimmed && line.startsWith(" ") || line.startsWith("\t")) {
			const leadingMatch = line.match(/^[\t ]+/);
			if (leadingMatch && !line.startsWith("    ")) {
				// Don't strip 4+ space indent (could be code block in some contexts)
				changesCount++;
				result.push(trimmed);
				continue;
			}
		}

		result.push(line);
	}

	return { content: result.join("\n"), changesCount };
}

export const lineLeadingWhitespaceRule: RuleDefinition = {
	id: "lineLeadingWhitespace",
	name: "Line leading whitespace",
	group: "whitespace",
	tier: "aggressive",
	example: "  text → text",
	fn: removeLineLeadingWhitespace,
};
