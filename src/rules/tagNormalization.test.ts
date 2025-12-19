import { describe, it, expect } from "vitest";
import { tagNormalizationRule } from "./tagNormalization";

describe("tagNormalizationRule", () => {
	it("lowercases tag", () => {
		const result = tagNormalizationRule.fn("#Tag");
		expect(result.content).toBe("#tag");
		expect(result.changesCount).toBe(1);
	});

	it("lowercases mixed case tag", () => {
		const result = tagNormalizationRule.fn("#MyTag");
		expect(result.content).toBe("#mytag");
		expect(result.changesCount).toBe(1);
	});

	it("leaves lowercase tag unchanged", () => {
		const result = tagNormalizationRule.fn("#tag");
		expect(result.content).toBe("#tag");
		expect(result.changesCount).toBe(0);
	});

	it("handles nested tags", () => {
		const result = tagNormalizationRule.fn("#Parent/Child");
		expect(result.content).toBe("#parent/child");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple tags in text", () => {
		const result = tagNormalizationRule.fn("text #Tag1 more #Tag2");
		expect(result.content).toBe("text #tag1 more #tag2");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify code blocks", () => {
		const input = "```\n#TAG\n```";
		const result = tagNormalizationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify inline code", () => {
		const input = "use `#TAG` constant";
		const result = tagNormalizationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles tag at start of line", () => {
		const result = tagNormalizationRule.fn("#StartTag");
		expect(result.content).toBe("#starttag");
		expect(result.changesCount).toBe(1);
	});
});
