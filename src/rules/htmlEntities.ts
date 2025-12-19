export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Decode common HTML entities to their characters
 * Skips content inside code blocks (``` and inline `)
 */
export function decodeHtmlEntities(content: string): RuleResult {
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

	// Process content while preserving code blocks
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

/**
 * Process text outside of code blocks
 */
function processOutsideCode(
	content: string,
	processor: (text: string) => string
): string {
	const parts: string[] = [];
	let remaining = content;

	// Match fenced code blocks and inline code
	const codePattern = /(```[\s\S]*?```|`[^`\n]+`)/g;
	let lastIndex = 0;
	let match;

	while ((match = codePattern.exec(content)) !== null) {
		// Process text before the code block
		if (match.index > lastIndex) {
			parts.push(processor(content.slice(lastIndex, match.index)));
		}
		// Keep code block unchanged
		parts.push(match[0]);
		lastIndex = match.index + match[0].length;
	}

	// Process remaining text after last code block
	if (lastIndex < content.length) {
		parts.push(processor(content.slice(lastIndex)));
	}

	return parts.join("");
}

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
