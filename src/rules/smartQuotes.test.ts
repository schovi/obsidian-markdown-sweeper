import { describe, it, expect } from "vitest";
import { smartQuotesRule } from "./smartQuotes";

describe("smartQuotesRule", () => {
	it("converts curly double quotes to straight", () => {
		const input = "\u201chello\u201d"; // "hello"
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe('"hello"');
		expect(result.changesCount).toBe(2);
	});

	it("converts curly single quotes to straight", () => {
		const input = "\u2018hello\u2019"; // 'hello'
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe("'hello'");
		expect(result.changesCount).toBe(2);
	});

	it("converts German quotes", () => {
		const input = "\u201ehello\u201c"; // „hello"
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe('"hello"');
		expect(result.changesCount).toBe(2);
	});

	it("converts French quotes", () => {
		const input = "\u00abhello\u00bb"; // «hello»
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe('"hello"');
		expect(result.changesCount).toBe(2);
	});

	it("converts single German quote", () => {
		const input = "\u201ahello\u2019"; // ‚hello'
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe("'hello'");
		expect(result.changesCount).toBe(2);
	});

	it("converts French single quotes", () => {
		const input = "\u2039hello\u203a"; // ‹hello›
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe("'hello'");
		expect(result.changesCount).toBe(2);
	});

	it("handles mixed quotes", () => {
		const input = "\u201cIt\u2019s a \u2018test\u2019\u201d"; // "It's a 'test'"
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe("\"It's a 'test'\"");
		expect(result.changesCount).toBe(5); // " ' ' ' "
	});

	it("does not modify straight quotes", () => {
		const input = '"hello" \'world\'';
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify content without smart quotes", () => {
		const input = "plain text here";
		const result = smartQuotesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
