import { describe, it, expect } from "vitest";
import { headingBlankLinesRule } from "./headingBlankLines";

describe("headingBlankLinesRule", () => {
	it("adds blank line before heading when missing", () => {
		const input = "Some text\n# Heading";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("Some text\n\n# Heading");
		expect(result.changesCount).toBe(1);
	});

	it("adds blank line after heading when missing", () => {
		const input = "# Heading\nSome text";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("# Heading\n\nSome text");
		expect(result.changesCount).toBe(1);
	});

	it("does not add blank line at start of file", () => {
		const input = "# Heading\n\nSome text";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("# Heading\n\nSome text");
		expect(result.changesCount).toBe(0);
	});

	it("does not add blank line between consecutive headings", () => {
		const input = "# Heading 1\n## Heading 2\n### Heading 3";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("# Heading 1\n## Heading 2\n### Heading 3");
		expect(result.changesCount).toBe(0);
	});

	it("adds blank line after last heading in sequence", () => {
		const input = "# Heading 1\n## Heading 2\nSome text";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("# Heading 1\n## Heading 2\n\nSome text");
		expect(result.changesCount).toBe(1);
	});

	it("handles both before and after in one pass", () => {
		const input = "Some text\n# Heading\nMore text";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("Some text\n\n# Heading\n\nMore text");
		expect(result.changesCount).toBe(2);
	});

	it("preserves existing blank lines", () => {
		const input = "Some text\n\n# Heading\n\nMore text";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("Some text\n\n# Heading\n\nMore text");
		expect(result.changesCount).toBe(0);
	});

	it("handles all heading levels", () => {
		const input = "Text\n## H2\nText\n### H3\nText\n#### H4\nText\n##### H5\nText\n###### H6\nText";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe(
			"Text\n\n## H2\n\nText\n\n### H3\n\nText\n\n#### H4\n\nText\n\n##### H5\n\nText\n\n###### H6\n\nText"
		);
		expect(result.changesCount).toBe(10);
	});

	it("does not treat non-headings as headings", () => {
		const input = "#hashtag\nSome text";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("#hashtag\nSome text");
		expect(result.changesCount).toBe(0);
	});

	it("handles heading at end of file", () => {
		const input = "Some text\n# Heading";
		const result = headingBlankLinesRule.fn(input);
		expect(result.content).toBe("Some text\n\n# Heading");
		expect(result.changesCount).toBe(1);
	});
});
