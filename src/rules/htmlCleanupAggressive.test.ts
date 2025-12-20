import { describe, it, expect } from "vitest";
import { htmlCleanupAggressiveRule } from "./htmlCleanupAggressive";

describe("htmlCleanupAggressiveRule", () => {
	it("decodes &lt; and &gt; to angle brackets", () => {
		const input = "&lt;div&gt;";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("");
		expect(result.changesCount).toBe(3); // 2 decodes + 1 strip
	});

	it("converts encoded HTML to markdown", () => {
		const input = "&lt;b&gt;bold&lt;/b&gt;";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("**bold**");
		expect(result.changesCount).toBe(5); // 4 decodes + 1 convert
	});

	it("strips unknown/custom tags", () => {
		const input = "<custom-element>content</custom-element>";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("content");
		expect(result.changesCount).toBe(2); // 2 tag strips
	});

	it("strips orphan tags", () => {
		const input = "text <here> more";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("text  more");
		expect(result.changesCount).toBe(1);
	});

	it("handles mixed encoded and real HTML", () => {
		const input = "<b>real bold</b> &lt;i&gt;encoded italic&lt;/i&gt;";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("**real bold** *encoded italic*");
	});

	it("fully cleans HTML-heavy content", () => {
		const input = "&lt;div class=&quot;foo&quot;&gt;&lt;span&gt;text&lt;/span&gt;&lt;/div&gt;";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("text\n");
	});

	it("preserves content inside code blocks", () => {
		const input = "```\n&lt;b&gt;code&lt;/b&gt;\n```";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("```\n&lt;b&gt;code&lt;/b&gt;\n```");
		expect(result.changesCount).toBe(0);
	});

	it("preserves content inside inline code", () => {
		const input = "use `&lt;div&gt;` tag";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe("use `&lt;div&gt;` tag");
		expect(result.changesCount).toBe(0);
	});

	it("handles no HTML content", () => {
		const input = "plain text without any HTML";
		const result = htmlCleanupAggressiveRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
