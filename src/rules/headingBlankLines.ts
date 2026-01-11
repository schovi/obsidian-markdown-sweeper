import { RuleResult, RuleDefinition } from "./types";

function ensureHeadingBlankLines(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const isHeading = /^#{1,6}\s/.test(line);
		const prevLine = i > 0 ? lines[i - 1] : null;
		const nextLine = i < lines.length - 1 ? lines[i + 1] : null;

		if (isHeading) {
			// Rule 1: Blank line before heading (except start of file)
			if (i > 0 && prevLine !== "" && !/^#{1,6}\s/.test(prevLine)) {
				result.push("");
				changesCount++;
			}

			result.push(line);

			// Rule 2: Blank line after heading unless another heading follows
			if (nextLine !== null && nextLine !== "" && !/^#{1,6}\s/.test(nextLine)) {
				result.push("");
				changesCount++;
			}
		} else {
			result.push(line);
		}
	}

	return { content: result.join("\n"), changesCount };
}

export const headingBlankLinesRule: RuleDefinition = {
	id: "headingBlankLines",
	name: "Heading blank lines",
	group: "headings",
	tier: "standard",
	example: "text\\n# H → text\\n\\n# H\\n\\n",
	fn: ensureHeadingBlankLines,
};
