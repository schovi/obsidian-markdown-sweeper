import { RuleDefinition } from "./types";
import { tabsToSpacesRule } from "./tabsToSpaces";
import { trailingWhitespaceContentRule, trailingWhitespaceBlankRule } from "./trailingWhitespace";
import { leadingIndentationRule } from "./leadingIndentation";
import { htmlEntitiesRule } from "./htmlEntities";
import { htmlTagsRule } from "./htmlTags";
import { smartQuotesRule } from "./smartQuotes";
import { linkSpacesRule } from "./linkSpaces";
import { headingSpacesRule } from "./headingSpaces";
import { checkboxesRule } from "./checkboxes";
import { multipleSpacesRule } from "./multipleSpaces";
import { blankLinesBetweenListItemsRule, multipleBlankLinesRule } from "./blankLines";
import { listMarkersRule } from "./listMarkers";
import { fixIndentationRule } from "./fixIndentation";
import { emptyListItemsRule } from "./emptyListItems";

export const rules: RuleDefinition[] = [
	tabsToSpacesRule,
	trailingWhitespaceContentRule,
	trailingWhitespaceBlankRule,
	leadingIndentationRule,
	htmlEntitiesRule,
	htmlTagsRule,
	smartQuotesRule,
	linkSpacesRule,
	headingSpacesRule,
	checkboxesRule,
	multipleSpacesRule,
	blankLinesBetweenListItemsRule,
	multipleBlankLinesRule,
	listMarkersRule,
	fixIndentationRule,
	emptyListItemsRule,
];
