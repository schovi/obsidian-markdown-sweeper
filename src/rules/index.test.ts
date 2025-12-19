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
		expect(result.summary.totalChanges).toBe(4);
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

	it("handles complex nested lists", () => {
		const input = `* Top level

  + Nested item 1

  + Nested item 2
* Another top level`;
		const result = applyAllRules(input);
		expect(result.content).toBe(`- Top level
  - Nested item 1
  - Nested item 2
- Another top level`);
	});
});

describe("formatSummary", () => {
	it("formats summary with all changes", () => {
		const summary: CleanupSummary = {
			blankLinesBetweenListItems: 2,
			multipleBlankLines: 3,
			normalizedListMarkers: 5,
			totalChanges: 10,
		};
		const result = formatSummary(summary);
		expect(result).toBe(
			"Cleaned: 2 blank line(s) between list items, 3 multiple blank line(s), 5 list marker(s) normalized"
		);
	});

	it("formats summary with only blank lines between items", () => {
		const summary: CleanupSummary = {
			blankLinesBetweenListItems: 1,
			multipleBlankLines: 0,
			normalizedListMarkers: 0,
			totalChanges: 1,
		};
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: 1 blank line(s) between list items");
	});

	it("formats summary with only multiple blank lines", () => {
		const summary: CleanupSummary = {
			blankLinesBetweenListItems: 0,
			multipleBlankLines: 2,
			normalizedListMarkers: 0,
			totalChanges: 2,
		};
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: 2 multiple blank line(s)");
	});

	it("formats summary with only normalized markers", () => {
		const summary: CleanupSummary = {
			blankLinesBetweenListItems: 0,
			multipleBlankLines: 0,
			normalizedListMarkers: 4,
			totalChanges: 4,
		};
		const result = formatSummary(summary);
		expect(result).toBe("Cleaned: 4 list marker(s) normalized");
	});

	it("returns 'No changes needed' when no changes", () => {
		const summary: CleanupSummary = {
			blankLinesBetweenListItems: 0,
			multipleBlankLines: 0,
			normalizedListMarkers: 0,
			totalChanges: 0,
		};
		const result = formatSummary(summary);
		expect(result).toBe("No changes needed");
	});
});
