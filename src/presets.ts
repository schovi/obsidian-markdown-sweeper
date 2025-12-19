import { rules } from "./rules/registry";
import { PresetTier } from "./rules/types";

const tierOrder: PresetTier[] = ["minimal", "standard", "aggressive"];

export function getPresetRules(preset: PresetTier): Record<string, boolean> {
	const enabled: Record<string, boolean> = {};
	const presetIndex = tierOrder.indexOf(preset);

	for (const rule of rules) {
		const ruleTierIndex = tierOrder.indexOf(rule.tier);
		enabled[rule.id] = ruleTierIndex <= presetIndex;
	}

	return enabled;
}

export const presetNames: Record<PresetTier, string> = {
	minimal: "Minimal",
	standard: "Standard",
	aggressive: "Aggressive",
};
