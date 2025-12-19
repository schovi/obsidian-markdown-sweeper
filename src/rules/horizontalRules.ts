import { RuleResult, RuleDefinition } from "./types";

function normalizeHorizontalRules(content: string): RuleResult {
	let changesCount = 0;

	// Match various horizontal rule formats:
	// ***, ***, ___,  - - -, etc. (3+ chars, optionally with spaces)
	const result = content.replace(
		/^[ \t]*((\*[ \t]*){3,}|(_[ \t]*){3,}|(- [ \t]*){2,}-)[ \t]*$/gm,
		(match) => {
			if (match.trim() === "---") {
				return match; // Already normalized
			}
			changesCount++;
			return "---";
		}
	);

	return { content: result, changesCount };
}

export const horizontalRulesRule: RuleDefinition = {
	id: "horizontalRules",
	name: "Horizontal rules",
	group: "formatting",
	example: "*** → ---",
	fn: normalizeHorizontalRules,
};
