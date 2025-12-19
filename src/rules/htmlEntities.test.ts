import { describe, it, expect } from "vitest";
import { decodeHtmlEntities } from "./htmlEntities";

describe("decodeHtmlEntities", () => {
	it("decodes &nbsp; to space", () => {
		const input = "hello&nbsp;world";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe("hello world");
		expect(result.changesCount).toBe(1);
	});

	it("decodes &amp; to &", () => {
		const input = "Tom &amp; Jerry";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe("Tom & Jerry");
		expect(result.changesCount).toBe(1);
	});

	it("decodes &lt; and &gt;", () => {
		const input = "&lt;div&gt;";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe("<div>");
		expect(result.changesCount).toBe(2);
	});

	it("decodes &quot;", () => {
		const input = '&quot;hello&quot;';
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe('"hello"');
		expect(result.changesCount).toBe(2);
	});

	it("decodes multiple entities", () => {
		const input = "&nbsp;&amp;&lt;&gt;";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe(" &<>");
		expect(result.changesCount).toBe(4);
	});

	it("is case insensitive", () => {
		const input = "&NBSP;&AMP;";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe(" &");
		expect(result.changesCount).toBe(2);
	});

	it("preserves entities inside inline code", () => {
		const input = "text `&nbsp;` more text";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe("text `&nbsp;` more text");
		expect(result.changesCount).toBe(0);
	});

	it("preserves entities inside fenced code blocks", () => {
		const input = "text\n```\n&nbsp;&amp;\n```\nmore";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe("text\n```\n&nbsp;&amp;\n```\nmore");
		expect(result.changesCount).toBe(0);
	});

	it("decodes entities outside code but preserves inside", () => {
		const input = "&nbsp; outside `&nbsp; inside` &amp; more";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe("  outside `&nbsp; inside` & more");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify content without entities", () => {
		const input = "plain text here";
		const result = decodeHtmlEntities(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
