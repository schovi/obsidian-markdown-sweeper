#!/usr/bin/env npx tsx
import * as fs from "fs";
import { applyAllRules } from "./rules";
import { getPresetRules } from "./presets";
import { PresetTier } from "./rules/types";

const args = process.argv.slice(2);
const verbose = args.includes("-v") || args.includes("--verbose");
const filteredArgs = args.filter((a) => a !== "-v" && a !== "--verbose");

if (filteredArgs.length === 0 || args.includes("--help") || args.includes("-h")) {
	console.error(`Usage: npx tsx src/cli.ts <file> [preset] [-v]

Arguments:
  file     Path to markdown file to clean
  preset   minimal | standard | aggressive (default: standard)
  -v       Verbose output (show rule changes to stderr)

Example:
  npx tsx src/cli.ts examples/mess.md
  npx tsx src/cli.ts examples/mess.md aggressive
  npx tsx src/cli.ts examples/mess.md standard -v`);
	process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
}

const file = filteredArgs[0];
const preset = (filteredArgs[1] as PresetTier) || "standard";

if (!["minimal", "standard", "aggressive"].includes(preset)) {
	console.error(`Invalid preset: ${preset}. Must be minimal, standard, or aggressive.`);
	process.exit(1);
}

if (!fs.existsSync(file)) {
	console.error(`File not found: ${file}`);
	process.exit(1);
}

const content = fs.readFileSync(file, "utf-8");
const enabledRules = getPresetRules(preset);
const result = applyAllRules(content, enabledRules);

if (verbose) {
	console.error(`\n=== Sweeper CLI (${preset} preset) ===\n`);
	const changes = [...result.summary.results.entries()]
		.filter(([, count]) => count > 0)
		.sort((a, b) => b[1] - a[1]);

	if (changes.length > 0) {
		console.error("Changes made:");
		for (const [ruleId, count] of changes) {
			console.error(`  ${ruleId}: ${count}`);
		}
		console.error(`\nTotal: ${result.summary.totalChanges} changes\n`);
	} else {
		console.error("No changes made.\n");
	}
}

console.log(result.content);
