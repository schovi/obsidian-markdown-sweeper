import { describe, it, expect } from "vitest";
import { removeTrailingWhitespace } from "./trailingWhitespace";

describe("removeTrailingWhitespace", () => {
	it("removes trailing spaces from content lines", () => {
		const input = "line 1   \nline 2  ";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.contentLinesCount).toBe(2);
		expect(result.blankLinesCount).toBe(0);
	});

	it("removes trailing tabs from content lines", () => {
		const input = "line 1\t\t\nline 2\t";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.contentLinesCount).toBe(2);
		expect(result.blankLinesCount).toBe(0);
	});

	it("removes mixed trailing whitespace", () => {
		const input = "line 1 \t \nline 2\t ";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.contentLinesCount).toBe(2);
		expect(result.blankLinesCount).toBe(0);
	});

	it("clears whitespace-only lines and counts them separately", () => {
		const input = "line 1\n   \nline 2";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe("line 1\n\nline 2");
		expect(result.contentLinesCount).toBe(0);
		expect(result.blankLinesCount).toBe(1);
	});

	it("counts both content and blank lines correctly", () => {
		const input = "line 1  \n   \nline 2  ";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe("line 1\n\nline 2");
		expect(result.contentLinesCount).toBe(2);
		expect(result.blankLinesCount).toBe(1);
	});

	it("preserves leading whitespace", () => {
		const input = "  indented line  ";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe("  indented line");
		expect(result.contentLinesCount).toBe(1);
		expect(result.blankLinesCount).toBe(0);
	});

	it("does not modify clean content", () => {
		const input = "line 1\nline 2\nline 3";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe(input);
		expect(result.contentLinesCount).toBe(0);
		expect(result.blankLinesCount).toBe(0);
	});

	it("handles empty lines correctly (no whitespace)", () => {
		const input = "line 1\n\nline 2";
		const result = removeTrailingWhitespace(input);
		expect(result.content).toBe(input);
		expect(result.contentLinesCount).toBe(0);
		expect(result.blankLinesCount).toBe(0);
	});
});
