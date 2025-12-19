import { RuleResult, RuleDefinition } from "./types";
import { processOutsideCode, escapeRegex } from "./utils";

function decodeHtmlEntities(content: string): RuleResult {
	let changesCount = 0;

	const entities: Record<string, string> = {
		"&nbsp;": " ",
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": '"',
		"&#39;": "'",
		"&apos;": "'",
	};

	const result = processOutsideCode(content, (text) => {
		let processed = text;
		for (const [entity, char] of Object.entries(entities)) {
			const regex = new RegExp(escapeRegex(entity), "gi");
			processed = processed.replace(regex, () => {
				changesCount++;
				return char;
			});
		}
		return processed;
	});

	return { content: result, changesCount };
}

export const htmlEntitiesRule: RuleDefinition = {
	id: "htmlEntities",
	name: "HTML entities",
	group: "code",
	tier: "aggressive",
	example: "&amp; → &",
	fn: decodeHtmlEntities,
};
