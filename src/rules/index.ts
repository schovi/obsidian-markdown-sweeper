import { rules } from "./registry";

export type { RuleResult, RuleDefinition } from "./types";

export interface CleanupResult {
	content: string;
	summary: CleanupSummary;
}

export interface CleanupSummary {
	results: Map<string, number>;
	totalChanges: number;
}

export function applyAllRules(content: string): CleanupResult {
	let result = content;
	const results = new Map<string, number>();

	for (const rule of rules) {
		const ruleResult = rule.fn(result);
		result = ruleResult.content;
		results.set(rule.id, ruleResult.changesCount);
	}

	const totalChanges = [...results.values()].reduce((a, b) => a + b, 0);
	return { content: result, summary: { results, totalChanges } };
}

export function formatSummary(summary: CleanupSummary): string {
	const parts = rules
		.filter((r) => (summary.results.get(r.id) || 0) > 0)
		.map((r) => r.name);

	if (parts.length === 0) {
		return "No changes needed";
	}

	return `Cleaned: ${parts.join(", ")}`;
}
