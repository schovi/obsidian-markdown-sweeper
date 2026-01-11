import { App, PluginSettingTab, Setting } from "obsidian";
import type SweeperPlugin from "./main";
import { rules } from "./rules/registry";
import { RuleGroup, ruleGroups, ruleGroupNames, RuleDefinition, PresetTier } from "./rules/types";
import { getPresetRules, presetNames } from "./presets";

export type CleanMode = "off" | "quick" | "preview";

export interface SweeperSettings {
	enabledRules: Record<string, boolean>;
	collapsedGroups: Record<string, boolean>;
	cleanOnSaveMode: CleanMode;
	cleanOnPasteMode: CleanMode;
	activePreset: PresetTier | "custom";
}

export function getDefaultSettings(): SweeperSettings {
	return {
		enabledRules: getPresetRules("standard"),
		collapsedGroups: {},
		cleanOnSaveMode: "off",
		cleanOnPasteMode: "off",
		activePreset: "standard",
	};
}

export function migrateSettings(data: Record<string, unknown>): void {
	if (typeof data.cleanOnSave === "boolean") {
		data.cleanOnSaveMode = data.cleanOnSave ? "quick" : "off";
		delete data.cleanOnSave;
	}
	if (typeof data.cleanOnPaste === "boolean") {
		data.cleanOnPasteMode = data.cleanOnPaste ? "preview" : "off";
		delete data.cleanOnPaste;
	}
}

export class SweeperSettingsTab extends PluginSettingTab {
	plugin: SweeperPlugin;

	constructor(app: App, plugin: SweeperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName("Behavior").setHeading();

		new Setting(containerEl)
			.setName("Clean on save")
			.setDesc("Clean markdown when you press Cmd/Ctrl+S")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("off", "Off")
					.addOption("quick", "Quick")
					.addOption("preview", "Preview")
					.setValue(this.plugin.settings.cleanOnSaveMode)
					.onChange(async (value) => {
						this.plugin.settings.cleanOnSaveMode = value as CleanMode;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Clean on paste")
			.setDesc("Clean pasted plain text from clipboard. Tip: Use Cmd/Ctrl+Shift+V to paste as plain text and avoid most formatting issues.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("off", "Off")
					.addOption("quick", "Quick")
					.addOption("preview", "Preview")
					.setValue(this.plugin.settings.cleanOnPasteMode)
					.onChange(async (value) => {
						this.plugin.settings.cleanOnPasteMode = value as CleanMode;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName("Cleanup rules").setHeading();

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
			cls: "sweeper-collapse-btn",
		});
		collapseBtn.addEventListener("click", () => {
			const newState = !allCollapsed;
			for (const group of ruleGroups) {
				this.plugin.settings.collapsedGroups[group] = newState;
			}
			void this.plugin.saveSettings().then(() => this.display());
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

		const groupContainer = container.createDiv({ cls: "sweeper-group" });

		const header = groupContainer.createDiv({ cls: "sweeper-group-header" });
		header.createSpan({
			text: isCollapsed ? "▶ " : "▼ ",
			cls: "sweeper-group-arrow",
		});
		header.createSpan({ text: ruleGroupNames[group] });
		header.createSpan({
			text: `${enabledCount} of ${groupRules.length}`,
			cls: "sweeper-group-count",
		});

		const rulesContainer = groupContainer.createDiv({
			cls: "sweeper-group-rules",
		});

		if (isCollapsed) {
			rulesContainer.addClass("is-collapsed");
		}

		header.addEventListener("click", () => {
			const nowCollapsed = !this.plugin.settings.collapsedGroups[group];
			this.plugin.settings.collapsedGroups[group] = nowCollapsed;
			void this.plugin.saveSettings().then(() => this.display());
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
