export interface RuleResult {
	content: string;
	changesCount: number;
}

export type RuleGroup =
	| "blankLines"
	| "whitespace"
	| "lists"
	| "formatting"
	| "headings"
	| "code"
	| "blockElements"
	| "obsidian";

export const ruleGroupNames: Record<RuleGroup, string> = {
	blankLines: "Blank lines",
	whitespace: "Whitespace",
	lists: "Lists",
	formatting: "Formatting",
	headings: "Headings",
	code: "Code",
	blockElements: "Block elements",
	obsidian: "Obsidian-specific",
};

export interface RuleDefinition {
	id: string;
	name: string;
	group: RuleGroup;
	example: string;
	fn: (content: string) => RuleResult;
}
