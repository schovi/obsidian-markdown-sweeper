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

	it("converts <p> to paragraph with newlines", () => {
		const input = "<p>paragraph</p>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("paragraph\n\n");
		expect(result.changesCount).toBe(1);
	});

	it("converts <div> to content with newline", () => {
		const input = "<div>content</div>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("content\n");
		expect(result.changesCount).toBe(1);
	});

	it("strips <span> tags preserving content", () => {
		const input = "text <span>inline</span> more";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("text inline more");
		expect(result.changesCount).toBe(1);
	});

	it("converts <strong> and <b> to **bold**", () => {
		const input = "<strong>bold</strong> and <b>bold</b>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("**bold** and **bold**");
		expect(result.changesCount).toBe(2);
	});

	it("converts <em> and <i> to *italic*", () => {
		const input = "<em>italic</em> and <i>italic</i>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("*italic* and *italic*");
		expect(result.changesCount).toBe(2);
	});

	it("converts <a> to [text](url)", () => {
		const input = '<a href="https://example.com">link</a>';
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("[link](https://example.com)");
		expect(result.changesCount).toBe(1);
	});

	it("strips <font> tags preserving content", () => {
		const input = '<font color="red">text</font>';
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("handles case insensitive tags", () => {
		const input = "<DIV>content</DIV>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("content\n");
		expect(result.changesCount).toBe(1);
	});

	it("does not modify content without tags", () => {
		const input = "plain text here";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("converts <code> to inline code", () => {
		const input = "Use <code>console.log()</code> for debugging";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("Use `console.log()` for debugging");
		expect(result.changesCount).toBe(1);
	});

	it("converts <pre> to code block", () => {
		const input = "<pre>const x = 1;\nconst y = 2;</pre>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("```\nconst x = 1;\nconst y = 2;\n```");
		expect(result.changesCount).toBe(1);
	});

	it("converts <del> to ~~strikethrough~~", () => {
		const input = "<del>removed</del>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("~~removed~~");
		expect(result.changesCount).toBe(1);
	});

	it("converts <mark> to ==highlight==", () => {
		const input = "<mark>important</mark>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("==important==");
		expect(result.changesCount).toBe(1);
	});

	it("converts <h1> to # heading", () => {
		const input = "<h1>Title</h1>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("# Title");
		expect(result.changesCount).toBe(1);
	});

	it("converts <h3> to ### heading", () => {
		const input = "<h3>Subtitle</h3>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("### Subtitle");
		expect(result.changesCount).toBe(1);
	});

	it("converts <ul> with <li> to unordered list", () => {
		const input = "<ul><li>item 1</li><li>item 2</li></ul>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("- item 1\n- item 2");
		expect(result.changesCount).toBe(1);
	});

	it("converts <ol> with <li> to ordered list", () => {
		const input = "<ol><li>first</li><li>second</li></ol>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("1. first\n2. second");
		expect(result.changesCount).toBe(1);
	});

	it("converts <hr> to ---", () => {
		const input = "above<hr>below";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("above---below");
		expect(result.changesCount).toBe(1);
	});

	it("converts <blockquote> to > quote", () => {
		const input = "<blockquote>quoted text</blockquote>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("> quoted text");
		expect(result.changesCount).toBe(1);
	});

	it("does not modify HTML inside code blocks", () => {
		const input = "```\n<b>bold</b>\n```";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify HTML inside inline code", () => {
		const input = "use `<div>` tag";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("modifies HTML outside code but not inside", () => {
		const input = "<b>outside</b> `<b>inside</b>` <b>outside</b>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("**outside** `<b>inside</b>` **outside**");
		expect(result.changesCount).toBe(2);
	});

	it("preserves unknown/custom HTML tags (standard tier behavior)", () => {
		const input = "<custom-element>content</custom-element>";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("<custom-element>content</custom-element>");
		expect(result.changesCount).toBe(0);
	});

	it("preserves orphan tags that look like HTML", () => {
		const input = "text <here> more text";
		const result = htmlTagsRule.fn(input);
		expect(result.content).toBe("text <here> more text");
		expect(result.changesCount).toBe(0);
	});
});
