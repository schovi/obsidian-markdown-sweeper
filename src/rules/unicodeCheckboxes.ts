import { RuleResult, RuleDefinition } from "./types";

function convertUnicodeCheckboxes(content: string): RuleResult {
	let changesCount = 0;

	let result = content;

	// Convert unchecked Unicode checkboxes to - [ ]
	// ☐ (U+2610 ballot box), □ (U+25A1 white square)
	result = result.replace(/^(\s*)[☐□]\s*/gm, (match, indent) => {
		changesCount++;
		return `${indent}- [ ] `;
	});

	// Convert checked Unicode checkboxes to - [x]
	// ☑ (U+2611 ballot box with check), ☒ (U+2612 ballot box with X), ■ (U+25A0 black square)
	result = result.replace(/^(\s*)[☑☒■]\s*/gm, (match, indent) => {
		changesCount++;
		return `${indent}- [x] `;
	});

	return { content: result, changesCount };
}

export const unicodeCheckboxesRule: RuleDefinition = {
	id: "unicodeCheckboxes",
	name: "Unicode checkboxes",
	group: "lists",
	tier: "standard",
	example: "☐ task → - [ ] task",
	fn: convertUnicodeCheckboxes,
};
