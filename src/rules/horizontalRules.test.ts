import { describe, it, expect } from "vitest";
import { horizontalRulesRule, horizontalRulesDedupeRule } from "./horizontalRules";

describe("horizontalRulesRule", () => {
	it("normalizes asterisk rules to dashes", () => {
		const result = horizontalRulesRule.fn("***");
		expect(result.content).toBe("---");
		expect(result.changesCount).toBe(1);
	});

	it("normalizes underscore rules to dashes", () => {
		const result = horizontalRulesRule.fn("___");
		expect(result.content).toBe("---");
		expect(result.changesCount).toBe(1);
	});

	it("normalizes spaced dashes", () => {
		const result = horizontalRulesRule.fn("- - -");
		expect(result.content).toBe("---");
		expect(result.changesCount).toBe(1);
	});

	it("leaves single --- unchanged", () => {
		const result = horizontalRulesRule.fn("---");
		expect(result.content).toBe("---");
		expect(result.changesCount).toBe(0);
	});
});

describe("horizontalRulesDedupeRule", () => {
	it("deduplicates consecutive horizontal rules", () => {
		const result = horizontalRulesDedupeRule.fn("---\n---\n---\n");
		expect(result.content).toBe("---\n");
		expect(result.changesCount).toBe(1);
	});

	it("deduplicates rules with blank lines between", () => {
		const result = horizontalRulesDedupeRule.fn("---\n\n---\n\n---\n");
		expect(result.content).toBe("---\n");
		expect(result.changesCount).toBe(1);
	});

	it("preserves content between separate rules", () => {
		const result = horizontalRulesDedupeRule.fn("---\n\nSome text\n\n---");
		expect(result.content).toBe("---\n\nSome text\n\n---");
		expect(result.changesCount).toBe(0);
	});

	it("leaves single rule unchanged", () => {
		const result = horizontalRulesDedupeRule.fn("---\n");
		expect(result.content).toBe("---\n");
		expect(result.changesCount).toBe(0);
	});
});
