import { RuleResult, RuleDefinition } from "./types";

function checkHeadingLevels(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");

	let lastLevel = 0;

	for (const line of lines) {
		const match = line.match(/^(#{1,6})\s/);
		if (!match) continue;

		const level = match[1].length;

		// Check for gap (skipping levels)
		if (lastLevel > 0 && level > lastLevel + 1) {
			changesCount++;
		}

		lastLevel = level;
	}

	// This rule only warns, doesn't fix
	// The count indicates how many heading level gaps were found
	return { content, changesCount };
}

export const headingLevelsRule: RuleDefinition = {
	id: "headingLevels",
	name: "Heading level gaps",
	group: "headings",
	example: "# → ### (warns)",
	fn: checkHeadingLevels,
};
