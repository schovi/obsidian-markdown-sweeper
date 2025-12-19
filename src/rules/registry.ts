import { RuleDefinition } from "./types";
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

export const rules: RuleDefinition[] = [
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
];
