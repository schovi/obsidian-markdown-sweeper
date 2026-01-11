import { describe, it, expect } from "vitest";
import { invisibleCharactersRule } from "./invisibleCharacters";

describe("invisibleCharactersRule", () => {
	it("removes zero-width space (U+200B)", () => {
		const input = "te\u200Bxt";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("removes zero-width non-joiner (U+200C)", () => {
		const input = "te\u200Cxt";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("removes zero-width joiner (U+200D)", () => {
		const input = "te\u200Dxt";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("removes BOM / zero-width no-break space (U+FEFF)", () => {
		const input = "\uFEFFtext";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe("text");
		expect(result.changesCount).toBe(1);
	});

	it("converts non-breaking space to regular space", () => {
		const input = "word\u00A0word";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe("word word");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple invisible characters", () => {
		const input = "\uFEFFhello\u200B \u00A0world\u200C";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe("hello  world");
		expect(result.changesCount).toBe(4);
	});

	it("does not modify clean text", () => {
		const input = "normal text here";
		const result = invisibleCharactersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
