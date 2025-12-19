import { RuleResult, RuleDefinition } from "./types";

function fixHeadingSpaces(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(
		/^(#{1,6})([^\s#])/gm,
		(match, hashes, firstChar) => {
			changesCount++;
			return `${hashes} ${firstChar}`;
		}
	);

	return { content: result, changesCount };
}

export const headingSpacesRule: RuleDefinition = {
	id: "headingSpaces",
	name: "Heading spaces",
	example: "##Title → ## Title",
	fn: fixHeadingSpaces,
};
