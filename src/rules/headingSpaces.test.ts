import { describe, it, expect } from "vitest";
import { fixHeadingSpaces } from "./headingSpaces";

describe("fixHeadingSpaces", () => {
	it("adds space after # heading", () => {
		const input = "#heading";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe("# heading");
		expect(result.changesCount).toBe(1);
	});

	it("adds space after ## heading", () => {
		const input = "##heading";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe("## heading");
		expect(result.changesCount).toBe(1);
	});

	it("adds space after ### heading", () => {
		const input = "###heading";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe("### heading");
		expect(result.changesCount).toBe(1);
	});

	it("handles up to 6 levels", () => {
		const input = "######heading";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe("###### heading");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple headings", () => {
		const input = "#heading1\n##heading2";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe("# heading1\n## heading2");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify correct headings", () => {
		const input = "# heading";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify headings with multiple spaces", () => {
		const input = "#  heading";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify # in middle of line", () => {
		const input = "text #hashtag here";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify more than 6 hashes", () => {
		const input = "#######notaheading";
		const result = fixHeadingSpaces(input);
		// 7+ hashes are not valid headings, left unchanged
		expect(result.content).toBe("#######notaheading");
		expect(result.changesCount).toBe(0);
	});

	it("does not modify content without headings", () => {
		const input = "plain text here";
		const result = fixHeadingSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
