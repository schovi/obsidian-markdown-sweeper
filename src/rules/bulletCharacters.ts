import { RuleResult, RuleDefinition } from "./types";

function convertBulletCharacters(content: string): RuleResult {
	let changesCount = 0;

	const result = content.replace(/^(\s*)[•◦▪▸►‣⁃○●]/gm, (match, indent) => {
		changesCount++;
		return `${indent}-`;
	});

	return { content: result, changesCount };
}

export const bulletCharactersRule: RuleDefinition = {
	id: "bulletCharacters",
	name: "Bullet characters",
	group: "lists",
	tier: "standard",
	example: "• item → - item",
	fn: convertBulletCharacters,
};
