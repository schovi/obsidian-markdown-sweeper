import { removeBlankLinesBetweenListItems, collapseMultipleBlankLines } from "./blankLines";
import { normalizeListMarkers } from "./listMarkers";
import { removeTrailingWhitespace } from "./trailingWhitespace";
import { removeCommonLeadingIndentation } from "./leadingIndentation";
import { decodeHtmlEntities } from "./htmlEntities";
import { removeHtmlTags } from "./htmlTags";
import { normalizeSmartQuotes } from "./smartQuotes";
import { fixLinkSpaces } from "./linkSpaces";
import { fixHeadingSpaces } from "./headingSpaces";
import { normalizeCheckboxes } from "./checkboxes";
import { collapseMultipleSpaces } from "./multipleSpaces";

export interface CleanupResult {
	content: string;
	summary: CleanupSummary;
}

export interface CleanupSummary {
	trailingWhitespaceContent: number;
	trailingWhitespaceBlank: number;
	commonIndentation: number;
	htmlEntities: number;
	htmlTags: number;
	smartQuotes: number;
	linkSpaces: number;
	headingSpaces: number;
	checkboxes: number;
	multipleSpaces: number;
	blankLinesBetweenListItems: number;
	multipleBlankLines: number;
	normalizedListMarkers: number;
	totalChanges: number;
}

/**
 * Apply all cleanup rules to the content
 */
export function applyAllRules(content: string): CleanupResult {
	let result = content;
	const summary: CleanupSummary = {
		trailingWhitespaceContent: 0,
		trailingWhitespaceBlank: 0,
		commonIndentation: 0,
		htmlEntities: 0,
		htmlTags: 0,
		smartQuotes: 0,
		linkSpaces: 0,
		headingSpaces: 0,
		checkboxes: 0,
		multipleSpaces: 0,
		blankLinesBetweenListItems: 0,
		multipleBlankLines: 0,
		normalizedListMarkers: 0,
		totalChanges: 0,
	};

	// Rule 1: Remove trailing whitespace first (makes other rules work better)
	const trailingResult = removeTrailingWhitespace(result);
	result = trailingResult.content;
	summary.trailingWhitespaceContent = trailingResult.contentLinesCount;
	summary.trailingWhitespaceBlank = trailingResult.blankLinesCount;

	// Rule 2: Remove common leading indentation
	const indentResult = removeCommonLeadingIndentation(result);
	result = indentResult.content;
	summary.commonIndentation = indentResult.changesCount;

	// Rule 3: Decode HTML entities (respects code blocks)
	const htmlEntitiesResult = decodeHtmlEntities(result);
	result = htmlEntitiesResult.content;
	summary.htmlEntities = htmlEntitiesResult.changesCount;

	// Rule 4: Remove HTML tags
	const htmlTagsResult = removeHtmlTags(result);
	result = htmlTagsResult.content;
	summary.htmlTags = htmlTagsResult.changesCount;

	// Rule 5: Normalize smart quotes
	const smartQuotesResult = normalizeSmartQuotes(result);
	result = smartQuotesResult.content;
	summary.smartQuotes = smartQuotesResult.changesCount;

	// Rule 6: Fix link spaces
	const linkSpacesResult = fixLinkSpaces(result);
	result = linkSpacesResult.content;
	summary.linkSpaces = linkSpacesResult.changesCount;

	// Rule 7: Fix heading spaces
	const headingSpacesResult = fixHeadingSpaces(result);
	result = headingSpacesResult.content;
	summary.headingSpaces = headingSpacesResult.changesCount;

	// Rule 8: Normalize checkboxes
	const checkboxesResult = normalizeCheckboxes(result);
	result = checkboxesResult.content;
	summary.checkboxes = checkboxesResult.changesCount;

	// Rule 9: Collapse multiple spaces
	const multipleSpacesResult = collapseMultipleSpaces(result);
	result = multipleSpacesResult.content;
	summary.multipleSpaces = multipleSpacesResult.changesCount;

	// Rule 10: Remove blank lines between list items
	const listBlankResult = removeBlankLinesBetweenListItems(result);
	result = listBlankResult.content;
	summary.blankLinesBetweenListItems = listBlankResult.changesCount;

	// Rule 11: Collapse multiple blank lines
	const multiBlankResult = collapseMultipleBlankLines(result);
	result = multiBlankResult.content;
	summary.multipleBlankLines = multiBlankResult.changesCount;

	// Rule 12: Normalize list markers
	const markerResult = normalizeListMarkers(result);
	result = markerResult.content;
	summary.normalizedListMarkers = markerResult.changesCount;

	summary.totalChanges =
		summary.trailingWhitespaceContent +
		summary.trailingWhitespaceBlank +
		summary.commonIndentation +
		summary.htmlEntities +
		summary.htmlTags +
		summary.smartQuotes +
		summary.linkSpaces +
		summary.headingSpaces +
		summary.checkboxes +
		summary.multipleSpaces +
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

	if (summary.trailingWhitespaceContent > 0 || summary.trailingWhitespaceBlank > 0) {
		parts.push("trailing whitespace");
	}
	if (summary.commonIndentation > 0) {
		parts.push(`${summary.commonIndentation}-space indent`);
	}
	if (summary.htmlEntities > 0) {
		parts.push("HTML entities");
	}
	if (summary.htmlTags > 0) {
		parts.push("HTML tags");
	}
	if (summary.smartQuotes > 0) {
		parts.push("smart quotes");
	}
	if (summary.linkSpaces > 0) {
		parts.push("link spaces");
	}
	if (summary.headingSpaces > 0) {
		parts.push("heading spaces");
	}
	if (summary.checkboxes > 0) {
		parts.push("checkboxes");
	}
	if (summary.multipleSpaces > 0) {
		parts.push("multiple spaces");
	}
	if (summary.blankLinesBetweenListItems > 0) {
		parts.push("blank lines in lists");
	}
	if (summary.multipleBlankLines > 0) {
		parts.push("extra blank lines");
	}
	if (summary.normalizedListMarkers > 0) {
		parts.push("list markers");
	}

	if (parts.length === 0) {
		return "No changes needed";
	}

	return `Cleaned: ${parts.join(", ")}`;
}
