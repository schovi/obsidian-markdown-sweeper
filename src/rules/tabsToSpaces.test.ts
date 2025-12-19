import { describe, it, expect } from "vitest";
import { tabsToSpacesRule } from "./tabsToSpaces";

describe("tabsToSpacesRule", () => {
	it("converts single leading tab to 2 spaces", () => {
		const input = "\t- item";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe("  - item");
		expect(result.changesCount).toBe(1);
	});

	it("converts multiple leading tabs", () => {
		const input = "\t\t- nested item";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe("    - nested item");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple lines with tabs", () => {
		const input = "\t- first\n\t\t- second\n\t- third";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe("  - first\n    - second\n  - third");
		expect(result.changesCount).toBe(3);
	});

	it("does not modify tabs in middle of line", () => {
		const input = "text\twith\ttabs";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify lines without leading tabs", () => {
		const input = "  - already spaces";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles mixed: leading tabs then content with tabs", () => {
		const input = "\ttext\twith\ttabs";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe("  text\twith\ttabs");
		expect(result.changesCount).toBe(1);
	});

	it("handles empty content", () => {
		const input = "";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe("");
		expect(result.changesCount).toBe(0);
	});

	it("handles tab-only line", () => {
		const input = "\t\t";
		const result = tabsToSpacesRule.fn(input);
		expect(result.content).toBe("    ");
		expect(result.changesCount).toBe(1);
	});
});
