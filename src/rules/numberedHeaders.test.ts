import { describe, it, expect } from "vitest";
import { numberedHeadersRule } from "./numberedHeaders";

describe("numberedHeadersRule", () => {
	it("converts single-level numbered header", () => {
		const result = numberedHeadersRule.fn("1 — Product overview");
		expect(result.content).toBe("## 1. Product overview");
		expect(result.changesCount).toBe(1);
	});

	it("converts second-level numbered header", () => {
		const result = numberedHeadersRule.fn("2.1 — Feature list");
		expect(result.content).toBe("### 2.1. Feature list");
		expect(result.changesCount).toBe(1);
	});

	it("converts third-level numbered header", () => {
		const result = numberedHeadersRule.fn("2.1.1 — MVP details");
		expect(result.content).toBe("#### 2.1.1. MVP details");
		expect(result.changesCount).toBe(1);
	});

	it("handles multiple headers in document", () => {
		const input = `1 — Overview

Some text here.

2 — Features
2.1 — MVP
2.2 — Future`;
		const result = numberedHeadersRule.fn(input);
		expect(result.content).toBe(`## 1. Overview

Some text here.

## 2. Features
### 2.1. MVP
### 2.2. Future`);
		expect(result.changesCount).toBe(4);
	});

	it("does not modify regular text with numbers", () => {
		const input = `This costs 1 — maybe 2 dollars.
See section 3.1 for details.`;
		const result = numberedHeadersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("does not modify lines without em dash", () => {
		const input = `1. Regular list item
2. Another item`;
		const result = numberedHeadersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles varying whitespace around em dash", () => {
		expect(numberedHeadersRule.fn("1—Title").content).toBe("## 1. Title");
		expect(numberedHeadersRule.fn("1  —  Title").content).toBe("## 1. Title");
	});

	it("converts Roman numeral headers", () => {
		expect(numberedHeadersRule.fn("I — Introduction").content).toBe(
			"## I. Introduction"
		);
		expect(numberedHeadersRule.fn("II — Methods").content).toBe(
			"## II. Methods"
		);
		expect(numberedHeadersRule.fn("III — Results").content).toBe(
			"## III. Results"
		);
		expect(numberedHeadersRule.fn("IV — Discussion").content).toBe(
			"## IV. Discussion"
		);
		expect(numberedHeadersRule.fn("XII — Appendix").content).toBe(
			"## XII. Appendix"
		);
	});

	it("converts Roman numeral headers with subsections", () => {
		expect(numberedHeadersRule.fn("II.1 — Subsection").content).toBe(
			"### II.1. Subsection"
		);
		expect(numberedHeadersRule.fn("II.1.1 — Deep section").content).toBe(
			"#### II.1.1. Deep section"
		);
	});

	it("converts letter headers", () => {
		expect(numberedHeadersRule.fn("A — First section").content).toBe(
			"## A. First section"
		);
		expect(numberedHeadersRule.fn("B — Second section").content).toBe(
			"## B. Second section"
		);
		expect(numberedHeadersRule.fn("Z — Last section").content).toBe(
			"## Z. Last section"
		);
	});

	it("converts letter headers with subsections", () => {
		expect(numberedHeadersRule.fn("A.1 — Subsection").content).toBe(
			"### A.1. Subsection"
		);
		expect(numberedHeadersRule.fn("B.2.1 — Deep section").content).toBe(
			"#### B.2.1. Deep section"
		);
	});

	it("does not convert lowercase letters (too many false positives)", () => {
		const input = "a — some text";
		const result = numberedHeadersRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});
});
