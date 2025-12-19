import { describe, it, expect } from "vitest";
import { trailingWhitespaceContentRule, trailingWhitespaceBlankRule } from "./trailingWhitespace";

describe("trailingWhitespaceContentRule", () => {
	it("removes trailing spaces from content lines", () => {
		const input = "line 1   \nline 2  ";
		const result = trailingWhitespaceContentRule.fn(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.changesCount).toBe(2);
	});

	it("removes trailing tabs from content lines", () => {
		const input = "line 1\t\t\nline 2\t";
		const result = trailingWhitespaceContentRule.fn(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.changesCount).toBe(2);
	});

	it("removes mixed trailing whitespace", () => {
		const input = "line 1 \t \nline 2\t ";
		const result = trailingWhitespaceContentRule.fn(input);
		expect(result.content).toBe("line 1\nline 2");
		expect(result.changesCount).toBe(2);
	});

	it("preserves leading whitespace", () => {
		const input = "  indented line  ";
		const result = trailingWhitespaceContentRule.fn(input);
		expect(result.content).toBe("  indented line");
		expect(result.changesCount).toBe(1);
	});

	it("does not modify clean content", () => {
		const input = "line 1\nline 2\nline 3";
		const result = trailingWhitespaceContentRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not touch whitespace-only lines (handled by blank rule)", () => {
		const input = "line 1\n   \nline 2";
		const result = trailingWhitespaceContentRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});

describe("trailingWhitespaceBlankRule", () => {
	it("clears whitespace-only lines", () => {
		const input = "line 1\n   \nline 2";
		const result = trailingWhitespaceBlankRule.fn(input);
		expect(result.content).toBe("line 1\n\nline 2");
		expect(result.changesCount).toBe(1);
	});

	it("clears multiple whitespace-only lines", () => {
		const input = "line 1\n   \n\t\t\nline 2";
		const result = trailingWhitespaceBlankRule.fn(input);
		expect(result.content).toBe("line 1\n\n\nline 2");
		expect(result.changesCount).toBe(2);
	});

	it("handles empty lines correctly (no whitespace)", () => {
		const input = "line 1\n\nline 2";
		const result = trailingWhitespaceBlankRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not touch content lines with trailing whitespace", () => {
		const input = "line with trailing  ";
		const result = trailingWhitespaceBlankRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
