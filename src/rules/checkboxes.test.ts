import { describe, it, expect } from "vitest";
import { checkboxesRule } from "./checkboxes";

describe("checkboxesRule", () => {
	it("adds space in empty checkbox - []", () => {
		const input = "- [] task";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe("- [ ] task");
		expect(result.changesCount).toBe(1);
	});

	it("converts uppercase X to lowercase", () => {
		const input = "- [X] done";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe("- [x] done");
		expect(result.changesCount).toBe(1);
	});

	it("handles * marker", () => {
		const input = "* [] task\n* [X] done";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe("* [ ] task\n* [x] done");
		expect(result.changesCount).toBe(2);
	});

	it("handles + marker", () => {
		const input = "+ [] task";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe("+ [ ] task");
		expect(result.changesCount).toBe(1);
	});

	it("handles indented checkboxes", () => {
		const input = "  - [] nested task";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe("  - [ ] nested task");
		expect(result.changesCount).toBe(1);
	});

	it("does not modify correct empty checkbox", () => {
		const input = "- [ ] task";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify correct checked checkbox", () => {
		const input = "- [x] done";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify [] not at line start", () => {
		const input = "text with [] brackets";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles multiple checkboxes", () => {
		const input = "- [] one\n- [X] two\n- [ ] three";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe("- [ ] one\n- [x] two\n- [ ] three");
		expect(result.changesCount).toBe(2);
	});

	it("does not modify content without checkboxes", () => {
		const input = "plain text here";
		const result = checkboxesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
