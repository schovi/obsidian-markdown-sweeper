import { describe, it, expect } from "vitest";
import { listMarkersRule } from "./listMarkers";

describe("listMarkersRule", () => {
	it("converts * to -", () => {
		const input = `* item 1
* item 2`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(2);
	});

	it("converts + to -", () => {
		const input = `+ item 1
+ item 2`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(2);
	});

	it("handles mixed markers", () => {
		const input = `- item 1
* item 2
+ item 3
- item 4`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`- item 1
- item 2
- item 3
- item 4`);
		expect(result.changesCount).toBe(2);
	});

	it("preserves indentation", () => {
		const input = `* item 1
  * nested 1
    * deeply nested`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`- item 1
  - nested 1
    - deeply nested`);
		expect(result.changesCount).toBe(3);
	});

	it("preserves spacing after marker", () => {
		const input = `*  item with double space
* item with single space`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`-  item with double space
- item with single space`);
		expect(result.changesCount).toBe(2);
	});

	it("does not modify - markers", () => {
		const input = `- item 1
- item 2
- item 3`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify * or + in middle of line", () => {
		const input = `This has * in the middle
This has + as well
- List item with * asterisk`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify emphasis markers", () => {
		const input = `*italic text*
**bold text**
Some text *emphasized* here`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles tab indentation", () => {
		const input = `	* tab indented item`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`	- tab indented item`);
		expect(result.changesCount).toBe(1);
	});

	it("adds space after - when missing", () => {
		const result = listMarkersRule.fn("-text");
		expect(result.content).toBe("- text");
		expect(result.changesCount).toBe(1);
	});

	it("adds space after - before checkbox", () => {
		const result = listMarkersRule.fn("-[x] task");
		expect(result.content).toBe("- [x] task");
		expect(result.changesCount).toBe(1);
	});

	it("adds space after numbered marker when missing", () => {
		const result = listMarkersRule.fn("1.text");
		expect(result.content).toBe("1. text");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple numbered items without space", () => {
		const input = `1.first
2.second
3.third`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(`1. first
2. second
3. third`);
		expect(result.changesCount).toBe(3);
	});

	it("does not modify horizontal rules", () => {
		const input = `---
text
---`;
		const result = listMarkersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
