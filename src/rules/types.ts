export interface RuleResult {
	content: string;
	/** Number of individual modifications made (e.g., regex replacements, lines changed) */
	changesCount: number;
}

export type PresetTier = "minimal" | "standard" | "aggressive";

export const ruleGroups = [
	"blankLines",
	"whitespace",
	"lists",
	"formatting",
	"headings",
	"code",
	"blockElements",
	"obsidian",
] as const;

export type RuleGroup = (typeof ruleGroups)[number];

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
	tier: PresetTier;
	example: string;
	fn: (content: string) => RuleResult;
}
