import { App, PluginSettingTab, Setting } from "obsidian";
import type MarkdownCleanupPlugin from "./main";
import { rules } from "./rules/registry";
import { RuleGroup, ruleGroupNames, RuleDefinition } from "./rules/types";

export interface MarkdownCleanupSettings {
	enabledRules: Record<string, boolean>;
	collapsedGroups: Record<string, boolean>;
}

export function getDefaultSettings(): MarkdownCleanupSettings {
	const enabledRules: Record<string, boolean> = {};
	for (const rule of rules) {
		enabledRules[rule.id] = true;
	}
	return { enabledRules, collapsedGroups: {} };
}

const groupOrder: RuleGroup[] = [
	"blankLines",
	"whitespace",
	"lists",
	"formatting",
	"headings",
	"code",
	"blockElements",
	"obsidian",
];

export class MarkdownCleanupSettingsTab extends PluginSettingTab {
	plugin: MarkdownCleanupPlugin;

	constructor(app: App, plugin: MarkdownCleanupPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Cleanup Rules" });

		const rulesByGroup = this.groupRules();

		for (const group of groupOrder) {
			const groupRules = rulesByGroup.get(group);
			if (!groupRules || groupRules.length === 0) continue;

			this.renderGroup(containerEl, group, groupRules);
		}
	}

	private groupRules(): Map<RuleGroup, RuleDefinition[]> {
		const grouped = new Map<RuleGroup, RuleDefinition[]>();
		for (const rule of rules) {
			const existing = grouped.get(rule.group) || [];
			existing.push(rule);
			grouped.set(rule.group, existing);
		}
		return grouped;
	}

	private renderGroup(
		container: HTMLElement,
		group: RuleGroup,
		groupRules: RuleDefinition[]
	): void {
		const isCollapsed = this.plugin.settings.collapsedGroups[group] ?? false;

		const groupContainer = container.createDiv({ cls: "md-cleanup-group" });

		const header = groupContainer.createDiv({ cls: "md-cleanup-group-header" });
		header.createSpan({
			text: isCollapsed ? "▶ " : "▼ ",
			cls: "md-cleanup-group-arrow",
		});
		header.createSpan({ text: ruleGroupNames[group] });

		const rulesContainer = groupContainer.createDiv({
			cls: "md-cleanup-group-rules",
		});

		if (isCollapsed) {
			rulesContainer.style.display = "none";
		}

		header.addEventListener("click", async () => {
			const nowCollapsed = !this.plugin.settings.collapsedGroups[group];
			this.plugin.settings.collapsedGroups[group] = nowCollapsed;
			await this.plugin.saveSettings();
			this.display();
		});

		for (const rule of groupRules) {
			new Setting(rulesContainer)
				.setName(rule.name)
				.setDesc(rule.example)
				.addToggle((toggle) =>
					toggle
						.setValue(this.plugin.settings.enabledRules[rule.id] ?? true)
						.onChange(async (value) => {
							this.plugin.settings.enabledRules[rule.id] = value;
							await this.plugin.saveSettings();
						})
				);
		}
	}
}
