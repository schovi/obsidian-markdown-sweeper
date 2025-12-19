import { describe, it, expect } from "vitest";
import { normalizeListMarkers } from "./listMarkers";

describe("normalizeListMarkers", () => {
	it("converts * to -", () => {
		const input = `* item 1
* item 2`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(2);
	});

	it("converts + to -", () => {
		const input = `+ item 1
+ item 2`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(`- item 1
- item 2`);
		expect(result.changesCount).toBe(2);
	});

	it("handles mixed markers", () => {
		const input = `- item 1
* item 2
+ item 3
- item 4`;
		const result = normalizeListMarkers(input);
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
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(`- item 1
  - nested 1
    - deeply nested`);
		expect(result.changesCount).toBe(3);
	});

	it("preserves spacing after marker", () => {
		const input = `*  item with double space
* item with single space`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(`-  item with double space
- item with single space`);
		expect(result.changesCount).toBe(2);
	});

	it("does not modify - markers", () => {
		const input = `- item 1
- item 2
- item 3`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify * or + in middle of line", () => {
		const input = `This has * in the middle
This has + as well
- List item with * asterisk`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify emphasis markers", () => {
		const input = `*italic text*
**bold text**
Some text *emphasized* here`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles tab indentation", () => {
		const input = `	* tab indented item`;
		const result = normalizeListMarkers(input);
		expect(result.content).toBe(`	- tab indented item`);
		expect(result.changesCount).toBe(1);
	});
});
