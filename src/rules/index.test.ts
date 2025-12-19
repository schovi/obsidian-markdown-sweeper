import { describe, it, expect } from "vitest";
import { applyAllRules, formatSummary, CleanupSummary } from "./index";

describe("applyAllRules", () => {
	it("applies all rules in sequence", () => {
		const input = `* item 1

* item 2


Some paragraph`;
		const result = applyAllRules(input);
		expect(result.content).toBe(`- item 1
- item 2

Some paragraph`);
		expect(result.summary.blankLinesBetweenListItems).toBe(1);
		expect(result.summary.multipleBlankLines).toBe(1);
		expect(result.summary.normalizedListMarkers).toBe(2);
	});

	it("returns correct summary when no changes needed", () => {
		const input = `- item 1
- item 2

Some paragraph`;
		const result = applyAllRules(input);
		expect(result.content).toBe(input);
		expect(result.summary.totalChanges).toBe(0);
	});

	it("handles empty input", () => {
		const result = applyAllRules("");
		expect(result.content).toBe("");
		expect(result.summary.totalChanges).toBe(0);
	});

	it("decodes HTML entities", () => {
		const input = "hello&nbsp;world &amp; more";
		const result = applyAllRules(input);
		expect(result.content).toBe("hello world & more");
		expect(result.summary.htmlEntities).toBe(2);
	});

	it("removes HTML tags", () => {
		const input = "<p>paragraph</p><br>next";
		const result = applyAllRules(input);
		expect(result.content).toBe("paragraph\nnext");
		expect(result.summary.htmlTags).toBe(3);
	});

	it("normalizes smart quotes", () => {
		const input = "\u201chello\u201d"; // "hello"
		const result = applyAllRules(input);
		expect(result.content).toBe('"hello"');
		expect(result.summary.smartQuotes).toBe(2);
	});

	it("fixes link spaces", () => {
		const input = "[link] (url)";
		const result = applyAllRules(input);
		expect(result.content).toBe("[link](url)");
		expect(result.summary.linkSpaces).toBe(1);
	});

	it("fixes heading spaces", () => {
		const input = "#heading";
		const result = applyAllRules(input);
		expect(result.content).toBe("# heading");
		expect(result.summary.headingSpaces).toBe(1);
	});

	it("normalizes checkboxes", () => {
		const input = "- [] task\n- [X] done";
		const result = applyAllRules(input);
		expect(result.content).toBe("- [ ] task\n- [x] done");
		expect(result.summary.checkboxes).toBe(2);
	});

	it("collapses multiple spaces", () => {
		const input = "word  word";
		const result = applyAllRules(input);
		expect(result.content).toBe("word word");
		expect(result.summary.multipleSpaces).toBe(1);
	});
});

const emptySummary: CleanupSummary = {
	trailingWhitespaceContent: 0,
	trailingWhitespaceBlank: 0,
	commonIndentation: 0,
	htmlEntities: 0,
	htmlTags: 0,
	smartQuotes: 0,
	linkSpaces: 0,
	headingSpaces: 0,
	checkboxes: 0,
	multipleSpaces: 0,
	blankLinesBetweenListItems: 0,
	multipleBlankLines: 0,
	normalizedListMarkers: 0,
	totalChanges: 0,
};

describe("formatSummary", () => {
	it("formats summary with multiple changes", () => {
		const summary: CleanupSummary = {
			...emptySummary,
			htmlEntities: 5,
			smartQuotes: 3,
			totalChanges: 8,
		};
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: HTML entities, smart quotes");
	});

	it("formats summary with trailing whitespace", () => {
		const summary: CleanupSummary = {
			...emptySummary,
			trailingWhitespaceContent: 10,
			totalChanges: 10,
		};
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: trailing whitespace");
	});

	it("formats summary with common indentation", () => {
		const summary: CleanupSummary = {
			...emptySummary,
			commonIndentation: 4,
			totalChanges: 4,
		};
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: 4-space indent");
	});

	it("formats summary with all change types", () => {
		const summary: CleanupSummary = {
			trailingWhitespaceContent: 1,
			trailingWhitespaceBlank: 1,
			commonIndentation: 2,
			htmlEntities: 1,
			htmlTags: 1,
			smartQuotes: 1,
			linkSpaces: 1,
			headingSpaces: 1,
			checkboxes: 1,
			multipleSpaces: 1,
			blankLinesBetweenListItems: 1,
			multipleBlankLines: 1,
			normalizedListMarkers: 1,
			totalChanges: 13,
		};
		const result = formatSummary(summary);
		expect(result).toBe(
			"Cleaned: trailing whitespace, 2-space indent, HTML entities, HTML tags, smart quotes, link spaces, heading spaces, checkboxes, multiple spaces, blank lines in lists, extra blank lines, list markers"
		);
	});

	it("returns 'No changes needed' when no changes", () => {
		const result = formatSummary(emptySummary);
		expect(result).toBe("No changes needed");
	});
});
