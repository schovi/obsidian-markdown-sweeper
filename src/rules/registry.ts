import { RuleDefinition } from "./types";
import { invisibleCharactersRule } from "./invisibleCharacters";
import { unicodeCheckboxesRule } from "./unicodeCheckboxes";
import { tabsToSpacesRule } from "./tabsToSpaces";
import { trailingWhitespaceContentRule, trailingWhitespaceBlankRule } from "./trailingWhitespace";
import { leadingIndentationRule } from "./leadingIndentation";
import { htmlEntitiesRule } from "./htmlEntities";
import { htmlTagsRule } from "./htmlTags";
import { htmlCleanupAggressiveRule } from "./htmlCleanupAggressive";
import { smartQuotesRule } from "./smartQuotes";
import { linkSpacesRule } from "./linkSpaces";
import { headingSpacesRule } from "./headingSpaces";
import { checkboxesRule } from "./checkboxes";
import { multipleSpacesRule } from "./multipleSpaces";
import { blankLinesBetweenListItemsRule, multipleBlankLinesRule } from "./blankLines";
import { listMarkersRule } from "./listMarkers";
import { bulletCharactersRule } from "./bulletCharacters";
import { fixIndentationRule } from "./fixIndentation";
import { emptyListItemsRule } from "./emptyListItems";
import { eofNewlineRule } from "./eofNewline";
import { horizontalRulesRule, horizontalRulesDedupeRule } from "./horizontalRules";
import { orderedListsRule } from "./orderedLists";
import { blockQuotesRule } from "./blockQuotes";
import { tagNormalizationRule } from "./tagNormalization";
import { codeFencesRule } from "./codeFences";
import { emphasisRule } from "./emphasis";
import { headingLevelsRule } from "./headingLevels";
import { headingBlankLinesRule } from "./headingBlankLines";
import { numberedHeadersRule } from "./numberedHeaders";
import { lineLeadingWhitespaceRule } from "./lineLeadingWhitespace";

export const rules: RuleDefinition[] = [
	// Invisible characters (run first to clean up hidden junk)
	invisibleCharactersRule,

	// Blank lines
	multipleBlankLinesRule,
	blankLinesBetweenListItemsRule,
	trailingWhitespaceBlankRule,
	eofNewlineRule,

	// Whitespace
	trailingWhitespaceContentRule,
	multipleSpacesRule,
	tabsToSpacesRule,
	leadingIndentationRule,

	// Numbered pseudo-headers (must run before Lists to avoid 1.1 being treated as list)
	numberedHeadersRule,

	// Lists
	bulletCharactersRule,
	unicodeCheckboxesRule,
	listMarkersRule,
	checkboxesRule,
	emptyListItemsRule,
	fixIndentationRule,
	orderedListsRule,

	// Formatting
	smartQuotesRule,
	linkSpacesRule,
	horizontalRulesRule,
	horizontalRulesDedupeRule,
	emphasisRule,
	codeFencesRule,

	// Headings
	headingSpacesRule,
	headingLevelsRule,
	headingBlankLinesRule,

	// HTML (standard: convert known HTML, decode safe entities)
	htmlTagsRule,
	htmlEntitiesRule,
	// HTML (aggressive: decode all entities, convert, strip remaining)
	htmlCleanupAggressiveRule,

	// Whitespace cleanup (after HTML conversion)
	lineLeadingWhitespaceRule,

	// Block elements
	blockQuotesRule,

	// Obsidian-specific
	tagNormalizationRule,
];
