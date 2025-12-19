import { describe, it, expect } from "vitest";
import { leadingIndentationRule } from "./leadingIndentation";

describe("leadingIndentationRule", () => {
	it("removes common 2-space indentation", () => {
		const input = `  line 1
  line 2
  line 3`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(`line 1
line 2
line 3`);
		expect(result.changesCount).toBe(3);
	});

	it("removes common 4-space indentation", () => {
		const input = `    line 1
    line 2`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(`line 1
line 2`);
		expect(result.changesCount).toBe(2);
	});

	it("preserves relative indentation", () => {
		const input = `  parent
    child
  sibling`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(`parent
  child
sibling`);
		expect(result.changesCount).toBe(3);
	});

	it("ignores empty lines when calculating minimum", () => {
		const input = `  line 1

  line 2`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(`line 1

line 2`);
		expect(result.changesCount).toBe(2);
	});

	it("keeps empty lines unchanged", () => {
		const input = `  line 1

  line 2`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(`line 1

line 2`);
		expect(result.changesCount).toBe(2);
	});

	it("does not modify content without common indentation", () => {
		const input = `line 1
  line 2
line 3`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles tab indentation", () => {
		const input = `\tline 1
\tline 2`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(`line 1
line 2`);
		expect(result.changesCount).toBe(2);
	});

	it("returns unchanged for no indentation", () => {
		const input = `line 1
line 2`;
		const result = leadingIndentationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
