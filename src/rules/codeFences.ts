import { RuleResult, RuleDefinition } from "./types";

function normalizeCodeFences(content: string): RuleResult {
	let changesCount = 0;

	// Replace ~~~ with ```
	let result = content.replace(/^(~~~+)(\w*)?$/gm, (match, tildes, lang) => {
		changesCount++;
		const backticks = "`".repeat(Math.max(3, tildes.length));
		return lang ? `${backticks}${lang}` : backticks;
	});

	return { content: result, changesCount };
}

export const codeFencesRule: RuleDefinition = {
	id: "codeFences",
	name: "Code fences",
	group: "code",
	tier: "aggressive",
	example: "~~~ → ```",
	fn: normalizeCodeFences,
};
