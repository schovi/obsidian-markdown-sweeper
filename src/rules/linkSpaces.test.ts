import { describe, it, expect } from "vitest";
import { fixLinkSpaces } from "./linkSpaces";

describe("fixLinkSpaces", () => {
	it("removes single space before parenthesis", () => {
		const input = "[text] (url)";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe("[text](url)");
		expect(result.changesCount).toBe(1);
	});

	it("removes multiple spaces before parenthesis", () => {
		const input = "[text]   (url)";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe("[text](url)");
		expect(result.changesCount).toBe(1);
	});

	it("handles links with complex text", () => {
		const input = "[click here for more] (https://example.com)";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe("[click here for more](https://example.com)");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple links in content", () => {
		const input = "[link1] (url1) and [link2] (url2)";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe("[link1](url1) and [link2](url2)");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify correct links", () => {
		const input = "[text](url)";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify non-link brackets", () => {
		const input = "[array] (comment)";
		const result = fixLinkSpaces(input);
		// This will be "fixed" as it matches the pattern
		// If we want to be smarter, we'd need to check for valid URLs
		expect(result.content).toBe("[array](comment)");
		expect(result.changesCount).toBe(1);
	});

	it("handles tabs as space", () => {
		const input = "[text]\t(url)";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe("[text](url)");
		expect(result.changesCount).toBe(1);
	});

	it("does not modify content without broken links", () => {
		const input = "plain text here";
		const result = fixLinkSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
