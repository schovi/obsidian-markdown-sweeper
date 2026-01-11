import { RuleResult, RuleDefinition } from "./types";

function fixHeadingSpaces(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(
		/^(#{1,6})([^\s#])/gm,
		(match, hashes, firstChar, offset, string) => {
			// Get the full line to check for multiple tags
			const lineStart = string.lastIndexOf("\n", offset) + 1;
			const lineEnd = string.indexOf("\n", offset);
			const line =
				lineEnd === -1
					? string.slice(lineStart)
					: string.slice(lineStart, lineEnd);

			// If line contains multiple #word patterns, it's tags not a header
			const tagMatches = line.match(/#[^\s#]+/g);
			if (tagMatches && tagMatches.length > 1) {
				return match;
			}

			changesCount++;
			return `${hashes} ${firstChar}`;
		}
	);

	return { content: result, changesCount };
}

export const headingSpacesRule: RuleDefinition = {
	id: "headingSpaces",
	name: "Heading spaces",
	group: "headings",
	tier: "standard",
	example: "##Title → ## Title",
	fn: fixHeadingSpaces,
};
