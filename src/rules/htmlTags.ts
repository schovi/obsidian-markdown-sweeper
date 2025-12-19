import { RuleResult, RuleDefinition } from "./types";

function removeHtmlTags(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	result = result.replace(/<br\s*\/?>/gi, () => {
		changesCount++;
		return "\n";
	});

	const tagsToRemove = [
		"p",
		"div",
		"span",
		"strong",
		"b",
		"em",
		"i",
		"u",
		"s",
		"strike",
		"del",
		"ins",
		"mark",
		"small",
		"sub",
		"sup",
		"a",
		"font",
	];

	for (const tag of tagsToRemove) {
		const openRegex = new RegExp(`<${tag}\\b[^>]*>`, "gi");
		result = result.replace(openRegex, () => {
			changesCount++;
			return "";
		});

		const closeRegex = new RegExp(`</${tag}>`, "gi");
		result = result.replace(closeRegex, () => {
			changesCount++;
			return "";
		});
	}

	return { content: result, changesCount };
}

export const htmlTagsRule: RuleDefinition = {
	id: "htmlTags",
	name: "HTML tags",
	fn: removeHtmlTags,
};
