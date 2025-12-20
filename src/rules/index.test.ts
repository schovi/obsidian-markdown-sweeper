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

Some paragraph
`);
		expect(result.summary.results.get("blankLinesBetweenListItems")).toBe(1);
		expect(result.summary.results.get("multipleBlankLines")).toBe(1);
		expect(result.summary.results.get("listMarkers")).toBe(2);
	});

	it("returns correct summary when no changes needed", () => {
		const input = `- item 1
- item 2

Some paragraph
`;
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
		expect(result.content).toBe("hello world & more\n");
		expect(result.summary.results.get("htmlEntities")).toBe(2);
	});

	it("converts HTML tags to markdown", () => {
		const input = "<b>bold</b> and <i>italic</i>";
		const result = applyAllRules(input);
		expect(result.content).toBe("**bold** and *italic*\n");
		expect(result.summary.results.get("htmlTags")).toBe(2);
	});

	it("normalizes smart quotes", () => {
		const input = "\u201chello\u201d"; // "hello"
		const result = applyAllRules(input);
		expect(result.content).toBe('"hello"\n');
		expect(result.summary.results.get("smartQuotes")).toBe(2);
	});

	it("fixes link spaces", () => {
		const input = "[link] (url)";
		const result = applyAllRules(input);
		expect(result.content).toBe("[link](url)\n");
		expect(result.summary.results.get("linkSpaces")).toBe(1);
	});

	it("fixes heading spaces", () => {
		const input = "#heading";
		const result = applyAllRules(input);
		expect(result.content).toBe("# heading\n");
		expect(result.summary.results.get("headingSpaces")).toBe(1);
	});

	it("normalizes checkboxes", () => {
		const input = "- [] task\n- [X] done";
		const result = applyAllRules(input);
		expect(result.content).toBe("- [ ] task\n- [x] done\n");
		expect(result.summary.results.get("checkboxes")).toBe(2);
	});

	it("collapses multiple spaces", () => {
		const input = "word  word";
		const result = applyAllRules(input);
		expect(result.content).toBe("word word\n");
		expect(result.summary.results.get("multipleSpaces")).toBe(1);
	});
});

function createEmptySummary(): CleanupSummary {
	return {
		results: new Map(),
		totalChanges: 0,
	};
}

describe("formatSummary", () => {
	it("formats summary with multiple changes", () => {
		const summary = createEmptySummary();
		summary.totalChanges = 8;
		const result = formatSummary(summary);
		expect(result).toBe("8 changes");
	});

	it("formats summary with single change", () => {
		const summary = createEmptySummary();
		summary.totalChanges = 1;
		const result = formatSummary(summary);
		expect(result).toBe("1 change");
	});

	it("returns 'No changes needed' when no changes", () => {
		const result = formatSummary(createEmptySummary());
		expect(result).toBe("No changes needed");
	});
});
