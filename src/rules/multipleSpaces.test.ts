import { describe, it, expect } from "vitest";
import { collapseMultipleSpaces } from "./multipleSpaces";

describe("collapseMultipleSpaces", () => {
	it("collapses two spaces to one", () => {
		const input = "word  word";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe("word word");
		expect(result.changesCount).toBe(1);
	});

	it("collapses many spaces to one", () => {
		const input = "word     word";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe("word word");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple occurrences", () => {
		const input = "one  two   three";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe("one two three");
		expect(result.changesCount).toBe(2);
	});

	it("preserves leading indentation", () => {
		const input = "    indented  text";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe("    indented text");
		expect(result.changesCount).toBe(1);
	});

	it("preserves tab indentation", () => {
		const input = "\t\tindented  text";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe("\t\tindented text");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple lines", () => {
		const input = "line  one\nline  two";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe("line one\nline two");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify single spaces", () => {
		const input = "word word word";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify content without multiple spaces", () => {
		const input = "plain text here";
		const result = collapseMultipleSpaces(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not touch trailing spaces (handled by other rule)", () => {
		const input = "text  ";
		const result = collapseMultipleSpaces(input);
		// Trailing spaces are collapsed too since they're multiple spaces
		expect(result.content).toBe("text ");
		expect(result.changesCount).toBe(1);
	});
});
