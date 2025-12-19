import { describe, it, expect } from "vitest";
import { emphasisRule } from "./emphasis";

describe("emphasisRule", () => {
	it("converts __bold__ to **bold**", () => {
		const result = emphasisRule.fn("__bold__");
		expect(result.content).toBe("**bold**");
		expect(result.changesCount).toBe(1);
	});

	it("converts _italic_ to *italic* at word boundaries", () => {
		const result = emphasisRule.fn("some _italic_ text");
		expect(result.content).toBe("some *italic* text");
		expect(result.changesCount).toBe(1);
	});

	it("does not affect snake_case", () => {
		const input = "some_variable_name";
		const result = emphasisRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles single character italic", () => {
		const result = emphasisRule.fn("_x_ value");
		expect(result.content).toBe("*x* value");
		expect(result.changesCount).toBe(1);
	});

	it("leaves *italic* unchanged", () => {
		const input = "some *italic* text";
		const result = emphasisRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("leaves **bold** unchanged", () => {
		const input = "some **bold** text";
		const result = emphasisRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify code blocks", () => {
		const input = "```\n__not_bold__\n```";
		const result = emphasisRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify inline code", () => {
		const input = "use `__init__` method";
		const result = emphasisRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
