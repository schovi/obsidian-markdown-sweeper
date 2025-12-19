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
		summary.results.set("htmlEntities", 5);
		summary.results.set("smartQuotes", 3);
		summary.totalChanges = 8;
		const result = formatSummary(summary);
		// Order follows registry order: smartQuotes before htmlEntities
		expect(result).toBe("Cleaned: Smart quotes, HTML entities");
	});

	it("formats summary with trailing whitespace", () => {
		const summary = createEmptySummary();
		summary.results.set("trailingWhitespaceContent", 10);
		summary.totalChanges = 10;
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: Trailing whitespace");
	});

	it("formats summary with common indentation", () => {
		const summary = createEmptySummary();
		summary.results.set("leadingIndentation", 4);
		summary.totalChanges = 4;
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: Common indentation");
	});

	it("formats summary with all change types", () => {
		const summary = createEmptySummary();
		summary.results.set("trailingWhitespaceContent", 1);
		summary.results.set("trailingWhitespaceBlank", 1);
		summary.results.set("leadingIndentation", 2);
		summary.results.set("htmlEntities", 1);
		summary.results.set("htmlTags", 1);
		summary.results.set("smartQuotes", 1);
		summary.results.set("linkSpaces", 1);
		summary.results.set("headingSpaces", 1);
		summary.results.set("checkboxes", 1);
		summary.results.set("multipleSpaces", 1);
		summary.results.set("blankLinesBetweenListItems", 1);
		summary.results.set("multipleBlankLines", 1);
		summary.results.set("listMarkers", 1);
		summary.totalChanges = 14;
		const result = formatSummary(summary);
		// Order follows registry order (by group)
		expect(result).toBe(
			"Cleaned: Extra blank lines, Blank lines in lists, Blank line whitespace, Trailing whitespace, Multiple spaces, Common indentation, List markers, Checkboxes, Smart quotes, Link spaces, Heading spaces, HTML entities, HTML to Markdown"
		);
	});

	it("returns 'No changes needed' when no changes", () => {
		const result = formatSummary(createEmptySummary());
		expect(result).toBe("No changes needed");
	});
});
