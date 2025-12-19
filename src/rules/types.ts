export interface RuleResult {
	content: string;
	changesCount: number;
}

export interface RuleDefinition {
	id: string;
	name: string;
	example: string;
	fn: (content: string) => RuleResult;
}
