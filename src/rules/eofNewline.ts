import { RuleResult, RuleDefinition } from "./types";

function normalizeEofNewline(content: string): RuleResult {
	if (content === "") {
		return { content, changesCount: 0 };
	}

	// Remove all trailing newlines and whitespace-only lines at the end
	const trimmed = content.replace(/[\n\r\s]+$/, "");

	// Add exactly one newline
	const result = trimmed + "\n";

	const changesCount = result !== content ? 1 : 0;
	return { content: result, changesCount };
}

export const eofNewlineRule: RuleDefinition = {
	id: "eofNewline",
	name: "EOF newline",
	group: "blankLines",
	tier: "minimal",
	example: "text\\n\\n\\n → text\\n",
	fn: normalizeEofNewline,
};
