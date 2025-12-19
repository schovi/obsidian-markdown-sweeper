export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Fix missing space after heading markers
 * #heading → # heading
 * ##heading → ## heading
 */
export function fixHeadingSpaces(content: string): RuleResult {
	let changesCount = 0;

	// Match # at start of line followed by non-space, non-# character
	const result = content.replace(
		/^(#{1,6})([^\s#])/gm,
		(match, hashes, firstChar) => {
			changesCount++;
			return `${hashes} ${firstChar}`;
		}
	);

	return { content: result, changesCount };
}
