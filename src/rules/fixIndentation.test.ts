import { describe, it, expect } from "vitest";
import { fixIndentationRule } from "./fixIndentation";

describe("fixIndentationRule", () => {
	it("does not modify correctly indented list", () => {
		const input = "- parent\n  - child\n    - grandchild";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("fixes excessive indentation on child", () => {
		const input = "- parent\n          - broken child";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("- parent\n  - broken child");
		expect(result.changesCount).toBe(1);
	});

	it("fixes excessive indentation on grandchild", () => {
		const input = "- parent\n  - child\n              - broken grandchild";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("- parent\n  - child\n    - broken grandchild");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple broken items", () => {
		const input = "- parent\n        - broken1\n            - broken2";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("- parent\n  - broken1\n    - broken2");
		expect(result.changesCount).toBe(2);
	});

	it("handles sibling after broken item", () => {
		const input = "- parent\n          - broken\n  - sibling";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("- parent\n  - broken\n  - sibling");
		expect(result.changesCount).toBe(1);
	});

	it("handles return to parent level", () => {
		const input = "- parent1\n  - child\n- parent2";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles numbered lists", () => {
		const input = "1. parent\n          2. broken child";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("1. parent\n  2. broken child");
		expect(result.changesCount).toBe(1);
	});

	it("handles mixed markers", () => {
		const input = "- parent\n          * broken child\n                + broken grandchild";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("- parent\n  * broken child\n    + broken grandchild");
		expect(result.changesCount).toBe(2);
	});

	it("preserves non-list content", () => {
		const input = "Some text\n- item\n          - broken\nMore text";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("Some text\n- item\n  - broken\nMore text");
		expect(result.changesCount).toBe(1);
	});

	it("handles empty content", () => {
		const input = "";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("");
		expect(result.changesCount).toBe(0);
	});

	it("handles single item", () => {
		const input = "- only item";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles deeply nested then return to root", () => {
		const input = "- a\n  - b\n    - c\n- d\n          - broken";
		const result = fixIndentationRule.fn(input);
		expect(result.content).toBe("- a\n  - b\n    - c\n- d\n  - broken");
		expect(result.changesCount).toBe(1);
	});
});
