import { describe, it, expect } from "vitest";
import { blankLinesBetweenListItemsRule, multipleBlankLinesRule } from "./blankLines";

describe("blankLinesBetweenListItemsRule", () => {
	it("removes single blank line between list items", () => {
		const input = `- item 1

- item 2`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(1);
	});

	it("removes multiple blank lines between list items", () => {
		const input = `- item 1


- item 2`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple gaps in a list", () => {
		const input = `- item 1

- item 2

- item 3`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2
- item 3`);
		expect(result.changesCount).toBe(2);
	});

	it("handles * markers", () => {
		const input = `* item 1

* item 2`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`* item 1
* item 2`);
		expect(result.changesCount).toBe(1);
	});

	it("handles + markers", () => {
		const input = `+ item 1

+ item 2`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`+ item 1
+ item 2`);
		expect(result.changesCount).toBe(1);
	});

	it("preserves indented list items", () => {
		const input = `- item 1
  - nested 1

  - nested 2
- item 2`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`- item 1
  - nested 1
  - nested 2
- item 2`);
		expect(result.changesCount).toBe(1);
	});

	it("does not modify content without blank lines between items", () => {
		const input = `- item 1
- item 2
- item 3`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("preserves blank lines between paragraphs and lists", () => {
		const input = `Some paragraph

- item 1
- item 2

Another paragraph`;
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles blank lines with whitespace between list items", () => {
		const input = "- item 1\n   \n- item 2";
		const result = blankLinesBetweenListItemsRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(1);
	});
});

describe("multipleBlankLinesRule", () => {
	it("collapses two blank lines into one", () => {
		const input = `paragraph 1


paragraph 2`;
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(`paragraph 1

paragraph 2`);
		expect(result.changesCount).toBe(1);
	});

	it("collapses many blank lines into one", () => {
		const input = `paragraph 1




paragraph 2`;
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(`paragraph 1

paragraph 2`);
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple occurrences", () => {
		const input = `paragraph 1


paragraph 2



paragraph 3`;
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(`paragraph 1

paragraph 2

paragraph 3`);
		expect(result.changesCount).toBe(2);
	});

	it("preserves single blank lines", () => {
		const input = `paragraph 1

paragraph 2

paragraph 3`;
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify content without multiple blank lines", () => {
		const input = `line 1
line 2
line 3`;
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("collapses blank lines that contain only whitespace", () => {
		const input = "paragraph 1\n   \n   \nparagraph 2";
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(`paragraph 1

paragraph 2`);
		expect(result.changesCount).toBe(1);
	});

	it("collapses mixed empty and whitespace-only lines", () => {
		const input = "paragraph 1\n\n   \n\nparagraph 2";
		const result = multipleBlankLinesRule.fn(input);
		expect(result.content).toBe(`paragraph 1

paragraph 2`);
		expect(result.changesCount).toBe(1);
	});
});
