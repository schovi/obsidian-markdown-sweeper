import { describe, it, expect } from "vitest";
import { unicodeCheckboxesRule } from "./unicodeCheckboxes";

describe("unicodeCheckboxesRule", () => {
	it("converts ☐ to unchecked checkbox", () => {
		const result = unicodeCheckboxesRule.fn("☐ Task item");
		expect(result.content).toBe("- [ ] Task item");
		expect(result.changesCount).toBe(1);
	});

	it("converts □ to unchecked checkbox", () => {
		const result = unicodeCheckboxesRule.fn("□ Task item");
		expect(result.content).toBe("- [ ] Task item");
		expect(result.changesCount).toBe(1);
	});

	it("converts ☑ to checked checkbox", () => {
		const result = unicodeCheckboxesRule.fn("☑ Done task");
		expect(result.content).toBe("- [x] Done task");
		expect(result.changesCount).toBe(1);
	});

	it("converts ☒ to checked checkbox", () => {
		const result = unicodeCheckboxesRule.fn("☒ Done task");
		expect(result.content).toBe("- [x] Done task");
		expect(result.changesCount).toBe(1);
	});

	it("converts ■ to checked checkbox", () => {
		const result = unicodeCheckboxesRule.fn("■ Done task");
		expect(result.content).toBe("- [x] Done task");
		expect(result.changesCount).toBe(1);
	});

	it("preserves indentation", () => {
		const input = `☐ Top level
  ☐ Nested
    ☑ Deep nested`;
		const result = unicodeCheckboxesRule.fn(input);
		expect(result.content).toBe(`- [ ] Top level
  - [ ] Nested
    - [x] Deep nested`);
		expect(result.changesCount).toBe(3);
	});

	it("handles mixed checkboxes", () => {
		const input = `☐ Todo
☑ Done
☒ Cancelled
□ Another todo
■ Another done`;
		const result = unicodeCheckboxesRule.fn(input);
		expect(result.content).toBe(`- [ ] Todo
- [x] Done
- [x] Cancelled
- [ ] Another todo
- [x] Another done`);
		expect(result.changesCount).toBe(5);
	});

	it("does not modify standard markdown checkboxes", () => {
		const input = `- [ ] Task
- [x] Done`;
		const result = unicodeCheckboxesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify checkbox chars in middle of line", () => {
		const input = "This has ☐ and ☑ in the middle";
		const result = unicodeCheckboxesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
