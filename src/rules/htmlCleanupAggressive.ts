import { RuleResult, RuleDefinition } from "./types";
import { processOutsideCode } from "./utils";
import { convertKnownHtmlTags, stripRemainingHtmlTags } from "./htmlTags";

/**
 * Aggressive HTML cleanup for content imported from HTML sources.
 * Runs after standard rules and handles:
 * 1. Decoding angle bracket entities (&lt; &gt;)
 * 2. Converting any resulting HTML to markdown
 * 3. Stripping all remaining HTML tags
 */
function aggressiveHtmlCleanup(content: string): RuleResult {
	let totalChanges = 0;

	const result = processOutsideCode(content, (text) => {
		let processed = text;

		// Step 1: Decode angle bracket entities
		const ltCount = (processed.match(/&lt;/gi) || []).length;
		const gtCount = (processed.match(/&gt;/gi) || []).length;
		processed = processed.replace(/&lt;/gi, "<");
		processed = processed.replace(/&gt;/gi, ">");
		totalChanges += ltCount + gtCount;

		// Step 2: Convert any HTML that emerged from decoded entities
		const converted = convertKnownHtmlTags(processed);
		processed = converted.content;
		totalChanges += converted.changesCount;

		// Step 3: Strip all remaining HTML tags
		const stripped = stripRemainingHtmlTags(processed);
		processed = stripped.content;
		totalChanges += stripped.changesCount;

		return processed;
	});

	return { content: result, changesCount: totalChanges };
}

export const htmlCleanupAggressiveRule: RuleDefinition = {
	id: "htmlCleanupAggressive",
	name: "Aggressive HTML cleanup",
	group: "html",
	tier: "aggressive",
	example: "&lt;b&gt;text&lt;/b&gt; → **text**",
	fn: aggressiveHtmlCleanup,
};
