import { App, PluginSettingTab, Setting } from "obsidian";
import type MarkdownCleanupPlugin from "./main";
import { rules } from "./rules/registry";
import { RuleGroup, ruleGroups, ruleGroupNames, RuleDefinition, PresetTier } from "./rules/types";
import { getPresetRules, presetNames } from "./presets";

export interface MarkdownCleanupSettings {
	enabledRules: Record<string, boolean>;
	collapsedGroups: Record<string, boolean>;
	cleanOnSave: boolean;
	activePreset: PresetTier | "custom";
}

export function getDefaultSettings(): MarkdownCleanupSettings {
	return {
		enabledRules: getPresetRules("standard"),
		collapsedGroups: {},
		cleanOnSave: false,
		activePreset: "standard",
	};
}

export class MarkdownCleanupSettingsTab extends PluginSettingTab {
	plugin: MarkdownCleanupPlugin;

	constructor(app: App, plugin: MarkdownCleanupPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Behavior" });

		new Setting(containerEl)
			.setName("Clean on save")
			.setDesc("Automatically clean markdown when saving a file")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.cleanOnSave)
					.onChange(async (value) => {
						this.plugin.settings.cleanOnSave = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", { text: "Cleanup Rules" });

		new Setting(containerEl)
			.setName("Preset")
			.setDesc("Quick-select rule sets. You can still toggle individual rules after.")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("minimal", presetNames.minimal)
					.addOption("standard", presetNames.standard)
					.addOption("aggressive", presetNames.aggressive)
					.addOption("custom", "Custom")
					.setValue(this.plugin.settings.activePreset)
					.onChange(async (value) => {
						const preset = value as PresetTier | "custom";
						if (preset !== "custom") {
							this.plugin.settings.enabledRules = getPresetRules(preset);
						}
						this.plugin.settings.activePreset = preset;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		const rulesByGroup = this.groupRules();
		const allCollapsed = ruleGroups.every((g) => this.plugin.settings.collapsedGroups[g]);

		const collapseBtn = containerEl.createEl("button", {
			text: allCollapsed ? "Expand all" : "Collapse all",
			cls: "md-cleanup-collapse-btn",
		});
		collapseBtn.addEventListener("click", async () => {
			const newState = !allCollapsed;
			for (const group of ruleGroups) {
				this.plugin.settings.collapsedGroups[group] = newState;
			}
			await this.plugin.saveSettings();
			this.display();
		});

		for (const group of ruleGroups) {
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
		const enabledCount = groupRules.filter(
			(r) => this.plugin.settings.enabledRules[r.id] ?? true
		).length;

		const groupContainer = container.createDiv({ cls: "md-cleanup-group" });

		const header = groupContainer.createDiv({ cls: "md-cleanup-group-header" });
		header.createSpan({
			text: isCollapsed ? "▶ " : "▼ ",
			cls: "md-cleanup-group-arrow",
		});
		header.createSpan({ text: ruleGroupNames[group] });
		header.createSpan({
			text: `${enabledCount} of ${groupRules.length}`,
			cls: "md-cleanup-group-count",
		});

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
							this.plugin.settings.activePreset = "custom";
							await this.plugin.saveSettings();
							this.display();
						})
				);
		}
	}
}
