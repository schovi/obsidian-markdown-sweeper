export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Remove HTML tags from content
 * Converts <br> to newline, strips other common tags
 */
export function removeHtmlTags(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	// Convert <br>, <br/>, <br /> to newline
	result = result.replace(/<br\s*\/?>/gi, () => {
		changesCount++;
		return "\n";
	});

	// Remove common HTML tags (keep content between them)
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
		// Opening tags with attributes
		const openRegex = new RegExp(`<${tag}\\b[^>]*>`, "gi");
		result = result.replace(openRegex, () => {
			changesCount++;
			return "";
		});

		// Closing tags
		const closeRegex = new RegExp(`</${tag}>`, "gi");
		result = result.replace(closeRegex, () => {
			changesCount++;
			return "";
		});
	}

	return { content: result, changesCount };
}
