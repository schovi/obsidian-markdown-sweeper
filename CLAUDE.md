# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Obsidian plugin for cleaning up messy markdown with a diff preview before applying changes. Shows users what will be changed and lets them approve before modifying.

## Commands

```bash
npm run dev          # Build in development mode (watch)
npm run build        # Type-check and build for production
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npx vitest run src/rules/blankLines.test.ts  # Run single test file
```

## Architecture

### Entry Points
- `src/main.ts` - Plugin registration, ribbon icon, command palette
- `src/CleanupModal.ts` - Diff preview modal using `diff` library

### Rules System
Rules live in `src/rules/`. Each rule:
- Implements `RuleDefinition` interface (id, name, fn)
- Returns `RuleResult` with transformed content and change count
- Is registered in `src/rules/registry.ts`
- Has co-located tests (`ruleName.test.ts`)

Adding a new rule:
1. Create `src/rules/yourRule.ts` with function + exported `RuleDefinition`
2. Add tests in `src/rules/yourRule.test.ts`
3. Import and add to `rules` array in `registry.ts`

### Key Types
- `RuleDefinition` - Rule interface (id, name, fn)
- `RuleResult` - { content, changesCount }
- `CleanupSummary` - Aggregated results from all rules
