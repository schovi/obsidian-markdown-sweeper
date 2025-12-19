import { removeBlankLinesBetweenListItems, collapseMultipleBlankLines } from "./blankLines";
import { normalizeListMarkers } from "./listMarkers";
import { removeTrailingWhitespace } from "./trailingWhitespace";

export interface CleanupResult {
	content: string;
	summary: CleanupSummary;
}

export interface CleanupSummary {
	blankLinesBetweenListItems: number;
	multipleBlankLines: number;
	normalizedListMarkers: number;
	trailingWhitespace: number;
	totalChanges: number;
}

/**
 * Apply all cleanup rules to the content
 */
export function applyAllRules(content: string): CleanupResult {
	let result = content;
	const summary: CleanupSummary = {
		blankLinesBetweenListItems: 0,
		multipleBlankLines: 0,
		normalizedListMarkers: 0,
		trailingWhitespace: 0,
		totalChanges: 0,
	};

	// Rule 1: Remove trailing whitespace first (makes other rules work better)
	const trailingResult = removeTrailingWhitespace(result);
	result = trailingResult.content;
	summary.trailingWhitespace = trailingResult.changesCount;

	// Rule 2: Remove blank lines between list items
	const listBlankResult = removeBlankLinesBetweenListItems(result);
	result = listBlankResult.content;
	summary.blankLinesBetweenListItems = listBlankResult.changesCount;

	// Rule 3: Collapse multiple blank lines
	const multiBlankResult = collapseMultipleBlankLines(result);
	result = multiBlankResult.content;
	summary.multipleBlankLines = multiBlankResult.changesCount;

	// Rule 4: Normalize list markers
	const markerResult = normalizeListMarkers(result);
	result = markerResult.content;
	summary.normalizedListMarkers = markerResult.changesCount;

	summary.totalChanges =
		summary.trailingWhitespace +
		summary.blankLinesBetweenListItems +
		summary.multipleBlankLines +
		summary.normalizedListMarkers;

	return { content: result, summary };
}

/**
 * Format the cleanup summary as a human-readable string
 */
export function formatSummary(summary: CleanupSummary): string {
	const parts: string[] = [];

	if (summary.trailingWhitespace > 0) {
		parts.push(`${summary.trailingWhitespace} trailing whitespace`);
	}
	if (summary.blankLinesBetweenListItems > 0) {
		parts.push(`${summary.blankLinesBetweenListItems} blank line(s) between list items`);
	}
	if (summary.multipleBlankLines > 0) {
		parts.push(`${summary.multipleBlankLines} multiple blank line(s)`);
	}
	if (summary.normalizedListMarkers > 0) {
		parts.push(`${summary.normalizedListMarkers} list marker(s) normalized`);
	}

	if (parts.length === 0) {
		return "No changes needed";
	}

	return `Cleaned: ${parts.join(", ")}`;
}
