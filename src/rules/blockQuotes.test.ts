import { describe, it, expect } from "vitest";
import { blockQuotesRule } from "./blockQuotes";

describe("blockQuotesRule", () => {
	it("adds space after >", () => {
		const result = blockQuotesRule.fn(">text");
		expect(result.content).toBe("> text");
		expect(result.changesCount).toBe(1);
	});

	it("normalizes multiple spaces to single space", () => {
		const result = blockQuotesRule.fn(">    text");
		expect(result.content).toBe("> text");
		expect(result.changesCount).toBe(1);
	});

	it("leaves correct format unchanged", () => {
		const result = blockQuotesRule.fn("> text");
		expect(result.content).toBe("> text");
		expect(result.changesCount).toBe(0);
	});

	it("handles nested blockquotes", () => {
		const result = blockQuotesRule.fn(">>nested");
		expect(result.content).toBe("> > nested");
		expect(result.changesCount).toBe(1);
	});

	it("handles deeply nested blockquotes", () => {
		const result = blockQuotesRule.fn(">>>deep");
		expect(result.content).toBe("> > > deep");
		expect(result.changesCount).toBe(1);
	});

	it("handles empty blockquote line", () => {
		const result = blockQuotesRule.fn(">");
		expect(result.content).toBe(">");
		expect(result.changesCount).toBe(0);
	});

	it("handles multiline blockquotes", () => {
		const input = `>first
>second
>third`;
		const result = blockQuotesRule.fn(input);
		expect(result.content).toBe(`> first
> second
> third`);
		expect(result.changesCount).toBe(3);
	});
});
