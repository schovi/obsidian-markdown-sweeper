import { describe, it, expect } from "vitest";
import { emptyListItemsRule } from "./emptyListItems";

describe("emptyListItemsRule", () => {
	it("removes empty bullet item", () => {
		const input = "- \nsome text";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("some text");
		expect(result.changesCount).toBe(1);
	});

	it("removes empty bullet item with no space after marker", () => {
		const input = "-\nsome text";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("some text");
		expect(result.changesCount).toBe(1);
	});

	it("removes empty numbered item", () => {
		const input = "1. \nsome text";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("some text");
		expect(result.changesCount).toBe(1);
	});

	it("keeps empty item with children", () => {
		const input = "- \n  - child";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("keeps empty numbered item with children", () => {
		const input = "1. \n  - child";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("removes nested empty item without children", () => {
		const input = "- parent\n  - \n- sibling";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("- parent\n- sibling");
		expect(result.changesCount).toBe(1);
	});

	it("keeps nested empty item with children", () => {
		const input = "- parent\n  - \n    - grandchild";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not remove item with content", () => {
		const input = "- has content\n- also has content";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("removes empty item at end of document", () => {
		const input = "- content\n- ";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("- content");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple empty items", () => {
		const input = "- \n- \n- content";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("- content");
		expect(result.changesCount).toBe(2);
	});

	it("handles different markers", () => {
		const input = "* \n+ \n- content";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("- content");
		expect(result.changesCount).toBe(2);
	});

	it("handles empty content", () => {
		const input = "";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("");
		expect(result.changesCount).toBe(0);
	});

	it("removes empty item when next line is text (not list)", () => {
		const input = "- \nplain text";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("plain text");
		expect(result.changesCount).toBe(1);
	});

	it("removes empty item when next line is blank", () => {
		const input = "- \n\n- content";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("\n- content");
		expect(result.changesCount).toBe(1);
	});

	it("removes empty item when next line is sibling (same level)", () => {
		const input = "- \n- sibling";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("- sibling");
		expect(result.changesCount).toBe(1);
	});

	it("removes empty item when next line is parent level", () => {
		const input = "  - \n- parent level";
		const result = emptyListItemsRule.fn(input);
		expect(result.content).toBe("- parent level");
		expect(result.changesCount).toBe(1);
	});
});
