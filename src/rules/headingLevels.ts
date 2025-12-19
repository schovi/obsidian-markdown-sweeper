import { RuleResult, RuleDefinition } from "./types";

function fixHeadingLevels(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	let lastLevel = 0;

	for (const line of lines) {
		const match = line.match(/^(#{1,6})(\s.*)$/);
		if (!match) {
			result.push(line);
			continue;
		}

		const currentLevel = match[1].length;
		const rest = match[2];

		let targetLevel = currentLevel;

		if (lastLevel === 0) {
			targetLevel = currentLevel;
		} else if (currentLevel > lastLevel + 1) {
			targetLevel = lastLevel + 1;
			changesCount++;
		}

		lastLevel = targetLevel;
		result.push("#".repeat(targetLevel) + rest);
	}

	return { content: result.join("\n"), changesCount };
}

export const headingLevelsRule: RuleDefinition = {
	id: "headingLevels",
	name: "Fix heading level gaps",
	group: "headings",
	tier: "aggressive",
	example: "# H1 → ### H3 becomes ## H2",
	fn: fixHeadingLevels,
};
