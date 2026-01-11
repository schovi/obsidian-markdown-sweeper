import { describe, it, expect } from "vitest";
import { bulletCharactersRule } from "./bulletCharacters";

describe("bulletCharactersRule", () => {
	it("converts • to -", () => {
		const input = `• item 1
• item 2`;
		const result = bulletCharactersRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(2);
	});

	it("converts all bullet character variants", () => {
		const input = `• bullet
◦ white bullet
▪ black square
▸ triangle
► pointer
‣ triangular bullet
⁃ hyphen bullet
○ white circle
● black circle`;
		const result = bulletCharactersRule.fn(input);
		expect(result.content).toBe(`- bullet
- white bullet
- black square
- triangle
- pointer
- triangular bullet
- hyphen bullet
- white circle
- black circle`);
		expect(result.changesCount).toBe(9);
	});

	it("preserves leading whitespace", () => {
		const input = `    •    DAU / MAU
    •    Pages per session`;
		const result = bulletCharactersRule.fn(input);
		expect(result.content).toBe(`    -    DAU / MAU
    -    Pages per session`);
		expect(result.changesCount).toBe(2);
	});

	it("preserves tab indentation", () => {
		const input = `	• tab indented item`;
		const result = bulletCharactersRule.fn(input);
		expect(result.content).toBe(`	- tab indented item`);
		expect(result.changesCount).toBe(1);
	});

	it("does not modify standard markdown bullets", () => {
		const input = `- item 1
- item 2`;
		const result = bulletCharactersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify bullet characters in middle of line", () => {
		const input = `This has • in the middle
- List item with • bullet`;
		const result = bulletCharactersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
