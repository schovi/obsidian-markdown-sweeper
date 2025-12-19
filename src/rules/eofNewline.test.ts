import { describe, it, expect } from "vitest";
import { eofNewlineRule } from "./eofNewline";

describe("eofNewlineRule", () => {
	it("adds newline if missing", () => {
		const result = eofNewlineRule.fn("text");
		expect(result.content).toBe("text\n");
		expect(result.changesCount).toBe(1);
	});

	it("removes extra trailing newlines", () => {
		const result = eofNewlineRule.fn("text\n\n\n");
		expect(result.content).toBe("text\n");
		expect(result.changesCount).toBe(1);
	});

	it("leaves single newline unchanged", () => {
		const result = eofNewlineRule.fn("text\n");
		expect(result.content).toBe("text\n");
		expect(result.changesCount).toBe(0);
	});

	it("handles empty content", () => {
		const result = eofNewlineRule.fn("");
		expect(result.content).toBe("");
		expect(result.changesCount).toBe(0);
	});

	it("removes trailing whitespace-only lines", () => {
		const result = eofNewlineRule.fn("text\n   \n\t\n");
		expect(result.content).toBe("text\n");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiline content", () => {
		const result = eofNewlineRule.fn("line1\nline2\nline3");
		expect(result.content).toBe("line1\nline2\nline3\n");
		expect(result.changesCount).toBe(1);
	});
});
