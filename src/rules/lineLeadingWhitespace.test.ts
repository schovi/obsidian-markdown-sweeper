import { describe, it, expect } from "vitest";
import { lineLeadingWhitespaceRule } from "./lineLeadingWhitespace";

describe("lineLeadingWhitespaceRule", () => {
	it("removes leading space from paragraph", () => {
		const result = lineLeadingWhitespaceRule.fn(" text");
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("removes leading tab from paragraph", () => {
		const result = lineLeadingWhitespaceRule.fn("\ttext");
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("removes multiple leading spaces", () => {
		const result = lineLeadingWhitespaceRule.fn("   text");
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("preserves list item indentation", () => {
		const input = `  - nested item
    - deeper`;
		const result = lineLeadingWhitespaceRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("preserves blockquote lines", () => {
		const input = `  > quoted text`;
		const result = lineLeadingWhitespaceRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("preserves numbered list indentation", () => {
		const input = `  1. item`;
		const result = lineLeadingWhitespaceRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify code blocks", () => {
		const input = "```\n  indented code\n```";
		const result = lineLeadingWhitespaceRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("preserves empty lines", () => {
		const input = "text\n\nmore text";
		const result = lineLeadingWhitespaceRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles mixed content", () => {
		const input = ` paragraph
- list item
  - nested
 another paragraph`;
		const result = lineLeadingWhitespaceRule.fn(input);
		expect(result.content).toBe(`paragraph
- list item
  - nested
another paragraph`);
		expect(result.changesCount).toBe(2);
	});

	it("fixes nbsp converted to space", () => {
		const result = lineLeadingWhitespaceRule.fn(" HTML&entities");
		expect(result.content).toBe("HTML&entities");
		expect(result.changesCount).toBe(1);
	});
});
