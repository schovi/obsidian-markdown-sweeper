import { RuleResult, RuleDefinition } from "./types";
import { processOutsideCode } from "./utils";

function convertHtmlToMarkdown(content: string): RuleResult {
	let changesCount = 0;

	const result = processOutsideCode(content, (text) => {
		let processed = text;

		// <br> → newline
		processed = processed.replace(/<br\s*\/?>/gi, () => {
			changesCount++;
			return "\n";
		});

		// <b>, <strong> → **text**
		processed = processed.replace(/<(b|strong)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
			changesCount++;
			return `**${inner}**`;
		});

		// <i>, <em> → *text*
		processed = processed.replace(/<(i|em)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
			changesCount++;
			return `*${inner}*`;
		});

		// <del>, <s>, <strike> → ~~text~~
		processed = processed.replace(/<(del|s|strike)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
			changesCount++;
			return `~~${inner}~~`;
		});

		// <code> → `text` (inline)
		processed = processed.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => {
			changesCount++;
			return `\`${inner}\``;
		});

		// <pre> → code block
		processed = processed.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
			changesCount++;
			// Remove nested code tags if present
			const cleaned = inner.replace(/<\/?code\b[^>]*>/gi, "");
			return "```\n" + cleaned.trim() + "\n```";
		});

		// <a href="url">text</a> → [text](url)
		processed = processed.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, url, text) => {
			changesCount++;
			return `[${text}](${url})`;
		});

		// <mark> → ==text== (some markdown flavors)
		processed = processed.replace(/<mark\b[^>]*>([\s\S]*?)<\/mark>/gi, (_, inner) => {
			changesCount++;
			return `==${inner}==`;
		});

		// <blockquote> → > text
		processed = processed.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
			changesCount++;
			const lines = inner.trim().split("\n");
			return lines.map((line: string) => `> ${line}`).join("\n");
		});

		// <h1> - <h6> → # - ######
		processed = processed.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
			changesCount++;
			return "#".repeat(parseInt(level)) + " " + inner.trim();
		});

		// <ul>/<ol> list items - convert <li> to - or numbered
		processed = processed.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
			changesCount++;
			return inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => `- ${li.trim()}\n`).trim();
		});

		processed = processed.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
			changesCount++;
			let num = 0;
			return inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
				num++;
				return `${num}. ${li.trim()}\n`;
			}).trim();
		});

		// <hr> → ---
		processed = processed.replace(/<hr\s*\/?>/gi, () => {
			changesCount++;
			return "---";
		});

		// <p>, <div> → add newlines
		processed = processed.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
			changesCount++;
			return inner.trim() + "\n\n";
		});

		processed = processed.replace(/<div\b[^>]*>([\s\S]*?)<\/div>/gi, (_, inner) => {
			changesCount++;
			return inner.trim() + "\n";
		});

		// Strip remaining tags with no markdown equivalent
		const tagsToStrip = ["span", "font", "u", "ins", "small", "sub", "sup"];
		for (const tag of tagsToStrip) {
			processed = processed.replace(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"), (_, inner) => {
				changesCount++;
				return inner;
			});
		}

		// Remove any remaining orphan open/close tags
		processed = processed.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, () => {
			changesCount++;
			return "";
		});

		return processed;
	});

	return { content: result, changesCount };
}

export const htmlTagsRule: RuleDefinition = {
	id: "htmlTags",
	name: "HTML to Markdown",
	group: "code",
	tier: "aggressive",
	example: "<b>text</b> → **text**",
	fn: convertHtmlToMarkdown,
};
