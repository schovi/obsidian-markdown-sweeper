import { describe, it, expect } from "vitest";
import { codeFencesRule } from "./codeFences";

describe("codeFencesRule", () => {
	it("converts ~~~ to ```", () => {
		const result = codeFencesRule.fn("~~~\ncode\n~~~");
		expect(result.content).toBe("```\ncode\n```");
		expect(result.changesCount).toBe(2);
	});

	it("preserves language specifier", () => {
		const result = codeFencesRule.fn("~~~javascript\ncode\n~~~");
		expect(result.content).toBe("```javascript\ncode\n```");
		expect(result.changesCount).toBe(2);
	});

	it("handles longer tilde sequences", () => {
		const result = codeFencesRule.fn("~~~~\ncode\n~~~~");
		expect(result.content).toBe("````\ncode\n````");
		expect(result.changesCount).toBe(2);
	});

	it("leaves ``` unchanged", () => {
		const input = "```\ncode\n```";
		const result = codeFencesRule.fn(input);
		expect(result.content).toBe(input);
		expect(result.changesCount).toBe(0);
	});

	it("handles mixed content", () => {
		const input = `Some text

~~~python
print("hello")
~~~

More text`;
		const result = codeFencesRule.fn(input);
		expect(result.content).toBe(`Some text

\`\`\`python
print("hello")
\`\`\`

More text`);
		expect(result.changesCount).toBe(2);
	});
});
