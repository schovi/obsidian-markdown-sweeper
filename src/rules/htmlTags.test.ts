import { describe, it, expect } from "vitest";
import { htmlTagsRule } from "./htmlTags";

describe("htmlTagsRule", () => {
	it("converts <br> to newline", () => {
		const input = "line 1<br>line 2";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.changesCount).toBe(1);
	});

	it("converts <br/> to newline", () => {
		const input = "line 1<br/>line 2";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.changesCount).toBe(1);
	});

	it("converts <br /> to newline", () => {
		const input = "line 1<br />line 2";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.changesCount).toBe(1);
	});

	it("removes <p> tags", () => {
		const input = "<p>paragraph</p>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("paragraph");
		expect(result.changesCount).toBe(2);
	});

	it("removes <div> tags", () => {
		const input = "<div>content</div>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("content");
		expect(result.changesCount).toBe(2);
	});

	it("removes <span> tags", () => {
		const input = "text <span>inline</span> more";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("text inline more");
		expect(result.changesCount).toBe(2);
	});

	it("removes <strong> and <b> tags", () => {
		const input = "<strong>bold</strong> and <b>bold</b>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("bold and bold");
		expect(result.changesCount).toBe(4);
	});

	it("removes <em> and <i> tags", () => {
		const input = "<em>italic</em> and <i>italic</i>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("italic and italic");
		expect(result.changesCount).toBe(4);
	});

	it("removes tags with attributes", () => {
		const input = '<a href="url">link</a>';
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("link");
		expect(result.changesCount).toBe(2);
	});

	it("removes <font> tags with attributes", () => {
		const input = '<font color="red">text</font>';
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(2);
	});

	it("handles case insensitive tags", () => {
		const input = "<DIV>content</DIV>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("content");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify content without tags", () => {
		const input = "plain text here";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
