export interface RuleResult {
	content: string;
	changesCount: number;
}

/**
 * Remove common leading indentation from all lines
 * Finds the minimum indentation across all non-empty lines and removes it
 */
export function removeCommonLeadingIndentation(content: string): RuleResult {
	const lines = content.split("\n");

	// Find minimum indentation among non-empty lines
	let minIndent = Infinity;
	for (const line of lines) {
		// Skip empty lines
		if (line.trim() === "") continue;

		const match = line.match(/^[ \t]*/);
		const indent = match ? match[0].length : 0;
		minIndent = Math.min(minIndent, indent);
	}

	// If no indentation to remove, return unchanged
	if (minIndent === 0 || minIndent === Infinity) {
		return { content, changesCount: 0 };
	}

	// Remove the common indentation from all lines
	const result = lines
		.map((line) => {
			if (line.trim() === "") return line; // Keep empty lines as-is
			return line.slice(minIndent);
		})
		.join("\n");

	return { content: result, changesCount: minIndent };
}
