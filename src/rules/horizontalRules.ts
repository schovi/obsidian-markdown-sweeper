import { RuleResult, RuleDefinition } from "./types";

function normalizeHorizontalRules(content: string): RuleResult {
	let changesCount = 0;
	let result = content;

	// Match various horizontal rule formats:
	// ***, ___, - - -, etc. (3+ chars, optionally with spaces)
	result = result.replace(
		/^[ \t]*((\*[ \t]*){3,}|(_[ \t]*){3,}|(- [ \t]*){2,}-)[ \t]*$/gm,
		(match) => {
			if (match.trim() === "---") {
				return match;
			}
			changesCount++;
			return "---";
		}
	);

	// Convert Unicode horizontal line characters to ---
	// ⸻ (two-em dash), ─ (box light), ━ (box heavy), ═ (box double), — (em dash repeated)
	result = result.replace(/^[ \t]*[⸻─━═—]{1,}[ \t]*$/gm, () => {
		changesCount++;
		return "---";
	});

	return { content: result, changesCount };
}

function deduplicateHorizontalRules(content: string): RuleResult {
	let changesCount = 0;

	// Deduplicate consecutive horizontal rules (with optional blank lines between)
	const result = content.replace(
		/(^---[ \t]*$\n)((?:[ \t]*\n)*^---[ \t]*$\n?)+/gm,
		() => {
			changesCount++;
			return "---\n";
		}
	);

	return { content: result, changesCount };
}

export const horizontalRulesRule: RuleDefinition = {
	id: "horizontalRules",
	name: "Horizontal rules",
	group: "formatting",
	tier: "aggressive",
	example: "*** → ---",
	fn: normalizeHorizontalRules,
};

export const horizontalRulesDedupeRule: RuleDefinition = {
	id: "horizontalRulesDedupe",
	name: "Deduplicate horizontal rules",
	group: "formatting",
	tier: "aggressive",
	example: "---,---,--- → ---",
	fn: deduplicateHorizontalRules,
};
