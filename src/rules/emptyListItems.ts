import { RuleResult, RuleDefinition } from "./types";

const EMPTY_LIST_ITEM_PATTERN = /^(\s*)([-*+]|\d+\.)\s*$/;
const LIST_ITEM_PATTERN = /^(\s*)([-*+]|\d+\.)\s/;

function removeEmptyListItems(content: string): RuleResult {
	let changesCount = 0;
	const lines = content.split("\n");
	const result: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const emptyMatch = line.match(EMPTY_LIST_ITEM_PATTERN);

		if (!emptyMatch) {
			result.push(line);
			continue;
		}

		const currentIndent = emptyMatch[1].length;
		const nextLine = lines[i + 1];

		if (nextLine !== undefined) {
			const nextMatch = nextLine.match(LIST_ITEM_PATTERN);

			if (nextMatch) {
				const nextIndent = nextMatch[1].length;

				if (nextIndent > currentIndent) {
					// Has children - keep this empty item
					result.push(line);
					continue;
				}
			}
		}

		// No children - remove this empty item
		changesCount++;
	}

	return { content: result.join("\n"), changesCount };
}

export const emptyListItemsRule: RuleDefinition = {
	id: "emptyListItems",
	name: "Empty list items",
	group: "lists",
	example: "- (empty) → removed",
	fn: removeEmptyListItems,
};
