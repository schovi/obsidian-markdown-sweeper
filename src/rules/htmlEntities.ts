import { RuleResult, RuleDefinition } from "./types";

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

function processOutsideCode(
	content: string,
	processor: (text: string) => string
): string {
	const parts: string[] = [];

	const codePattern = /(```[\s\S]*?```|`[^`\n]+`)/g;
	let lastIndex = 0;
	let match;

	while ((match = codePattern.exec(content)) !== null) {
		if (match.index > lastIndex) {
			parts.push(processor(content.slice(lastIndex, match.index)));
		}
		parts.push(match[0]);
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < content.length) {
		parts.push(processor(content.slice(lastIndex)));
	}

	return parts.join("");
}

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const htmlEntitiesRule: RuleDefinition = {
	id: "htmlEntities",
	name: "HTML entities",
	fn: decodeHtmlEntities,
};
