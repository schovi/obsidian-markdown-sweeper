import { RuleResult, RuleDefinition } from "./types";

function convertHtmlToMarkdown(content: string): RuleResult {
	let changesCount = 0;
	let result = content;

	// <br> → newline
	result = result.replace(/<br\s*\/?>/gi, () => {
		changesCount++;
		return "\n";
	});

	// <b>, <strong> → **text**
	result = result.replace(/<(b|strong)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
		changesCount++;
		return `**${inner}**`;
	});

	// <i>, <em> → *text*
	result = result.replace(/<(i|em)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
		changesCount++;
		return `*${inner}*`;
	});

	// <del>, <s>, <strike> → ~~text~~
	result = result.replace(/<(del|s|strike)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
		changesCount++;
		return `~~${inner}~~`;
	});

	// <code> → `text` (inline)
	result = result.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => {
		changesCount++;
		return `\`${inner}\``;
	});

	// <pre> → code block
	result = result.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
		changesCount++;
		// Remove nested code tags if present
		const cleaned = inner.replace(/<\/?code\b[^>]*>/gi, "");
		return "```\n" + cleaned.trim() + "\n```";
	});

	// <a href="url">text</a> → [text](url)
	result = result.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, url, text) => {
		changesCount++;
		return `[${text}](${url})`;
	});

	// <mark> → ==text== (some markdown flavors)
	result = result.replace(/<mark\b[^>]*>([\s\S]*?)<\/mark>/gi, (_, inner) => {
		changesCount++;
		return `==${inner}==`;
	});

	// <blockquote> → > text
	result = result.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
		changesCount++;
		const lines = inner.trim().split("\n");
		return lines.map((line: string) => `> ${line}`).join("\n");
	});

	// <h1> - <h6> → # - ######
	result = result.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
		changesCount++;
		return "#".repeat(parseInt(level)) + " " + inner.trim();
	});

	// <ul>/<ol> list items - convert <li> to - or numbered
	result = result.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
		changesCount++;
		return inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => `- ${li.trim()}\n`).trim();
	});

	result = result.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
		changesCount++;
		let num = 0;
		return inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
			num++;
			return `${num}. ${li.trim()}\n`;
		}).trim();
	});

	// <hr> → ---
	result = result.replace(/<hr\s*\/?>/gi, () => {
		changesCount++;
		return "---";
	});

	// <p>, <div> → add newlines
	result = result.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
		changesCount++;
		return inner.trim() + "\n\n";
	});

	result = result.replace(/<div\b[^>]*>([\s\S]*?)<\/div>/gi, (_, inner) => {
		changesCount++;
		return inner.trim() + "\n";
	});

	// Strip remaining tags with no markdown equivalent
	const tagsToStrip = ["span", "font", "u", "ins", "small", "sub", "sup"];
	for (const tag of tagsToStrip) {
		result = result.replace(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"), (_, inner) => {
			changesCount++;
			return inner;
		});
	}

	// Remove any remaining orphan open/close tags
	result = result.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, () => {
		changesCount++;
		return "";
	});

	return { content: result, changesCount };
}

export const htmlTagsRule: RuleDefinition = {
	id: "htmlTags",
	name: "HTML to Markdown",
	group: "code",
	example: "<b>text</b> → **text**",
	fn: convertHtmlToMarkdown,
};
