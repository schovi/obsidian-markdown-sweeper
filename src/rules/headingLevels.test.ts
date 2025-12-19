import { describe, it, expect } from "vitest";
import { headingLevelsRule } from "./headingLevels";

describe("headingLevelsRule", () => {
	it("leaves proper hierarchy unchanged", () => {
		const input = `# Heading 1

## Heading 2

### Heading 3`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("fixes h1 → h3 skip to h1 → h2", () => {
		const input = `# Heading 1

### Heading 3`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(`# Heading 1

## Heading 3`);
		expect(result.changesCount).toBe(1);
	});

	it("fixes multiple skipped levels", () => {
		const input = `# Heading 1

#### Heading 4`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(`# Heading 1

## Heading 4`);
		expect(result.changesCount).toBe(1);
	});

	it("allows going back up to any level", () => {
		const input = `# Heading 1

## Heading 2

### Heading 3

# Back to H1`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("fixes cascading skips correctly", () => {
		const input = `# H1

### H3

##### H5`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(`# H1

## H3

### H5`);
		expect(result.changesCount).toBe(2);
	});

	it("preserves first heading at any level", () => {
		const input = `### Starting at H3

#### Next heading`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles content between headings", () => {
		const input = `# Title

Some paragraph text.

### Skipped to H3

More text here.`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(`# Title

Some paragraph text.

## Skipped to H3

More text here.`);
		expect(result.changesCount).toBe(1);
	});

	it("handles no headings", () => {
		const input = `Just some text
without any headings.`;
		const result = headingLevelsRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
