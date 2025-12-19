import { describe, it, expect } from "vitest";
import { orderedListsRule } from "./orderedLists";

describe("orderedListsRule", () => {
	it("renumbers sequential items starting from 1", () => {
		const input = `1. first
1. second
1. third`;
		const result = orderedListsRule.fn(input);
		expect(result.content).toBe(`1. first
2. second
3. third`);
		expect(result.changesCount).toBe(2);
	});

	it("fixes incorrect numbering", () => {
		const input = `5. first
2. second
9. third`;
		const result = orderedListsRule.fn(input);
		expect(result.content).toBe(`1. first
2. second
3. third`);
		expect(result.changesCount).toBe(2);
	});

	it("leaves correct numbering unchanged", () => {
		const input = `1. first
2. second
3. third`;
		const result = orderedListsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles nested lists", () => {
		const input = `1. first
   1. nested
   1. nested
1. second`;
		const result = orderedListsRule.fn(input);
		expect(result.content).toBe(`1. first
   1. nested
   2. nested
2. second`);
		expect(result.changesCount).toBe(2);
	});

	it("resets counter after non-list content", () => {
		const input = `1. first
2. second

Some paragraph.

1. new list`;
		const result = orderedListsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles no ordered lists", () => {
		const input = `- unordered
- list`;
		const result = orderedListsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
