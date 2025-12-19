import { App, PluginSettingTab, Setting } from "obsidian";
import type MarkdownCleanupPlugin from "./main";
import { rules } from "./rules/registry";

export interface MarkdownCleanupSettings {
	enabledRules: Record<string, boolean>;
}

export function getDefaultSettings(): MarkdownCleanupSettings {
	const enabledRules: Record<string, boolean> = {};
	for (const rule of rules) {
		enabledRules[rule.id] = true;
	}
	return { enabledRules };
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

		containerEl.createEl("h2", { text: "Cleanup Rules" });

		for (const rule of rules) {
			new Setting(containerEl)
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
