# Markdown Cleanup

An Obsidian plugin that cleans up messy markdown with a diff preview before applying changes.

## Why?

Markdown comes from everywhere - copy-pasted from web pages, exported from Notion, converted from Word docs, or AI-generated content. Each source introduces its own quirks:

- Smart quotes and curly apostrophes instead of straight ones
- HTML entities like `&amp;` and `&nbsp;` littered throughout
- Inconsistent list markers (`*`, `+`, `-`)
- Broken indentation and excessive whitespace
- HTML tags mixed with markdown

This plugin normalizes all of it with a single command, showing you exactly what will change before applying.

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community Plugins
2. Search for "Markdown Cleanup"
3. Install and enable

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create folder: `<vault>/.obsidian/plugins/md-cleanup/`
3. Copy the files into that folder
4. Enable in Settings → Community Plugins

## Usage

### Commands

| Command | Description |
|---------|-------------|
| **Cleanup Markdown** | Shows diff preview, apply changes with confirmation |
| **Quick Cleanup** | Applies all enabled rules immediately (no preview) |
| **Paste and Clean** | Pastes clipboard content and cleans it in one step |

Access via Command Palette (`Cmd/Ctrl + P`) or the ribbon icon.

### Selection Mode

- **No selection**: Cleans entire document
- **With selection**: Cleans only selected text

### Diff Preview

The diff modal shows:
- **Red lines**: Content being removed
- **Green lines**: Content being added
- **Orange highlight**: Whitespace-only changes
- Visible whitespace markers: `·` for spaces, `→` for tabs

## Presets

Choose how aggressive the cleanup should be:

| Preset | Description |
|--------|-------------|
| **Minimal** | Safe fixes - trailing whitespace, blank lines, EOF newline |
| **Standard** | Common normalizations - list markers, heading spaces, tabs |
| **Aggressive** | Full cleanup - HTML conversion, smart quotes, emphasis style |

Presets are cumulative: Standard includes all Minimal rules, Aggressive includes all Standard rules.

You can also switch to **Custom** mode and toggle individual rules.

## Rules

### Blank Lines

| Rule | Preset | Example |
|------|--------|---------|
| Extra blank lines | Minimal | `3+ blank lines` → `1 blank line` |
| Blank line whitespace | Minimal | `···` (empty line) → `` (empty line) |
| EOF newline | Minimal | `text\n\n\n` → `text\n` |
| Blank lines in lists | Aggressive | `- a\n\n- b` → `- a\n- b` |

### Whitespace

| Rule | Preset | Example |
|------|--------|---------|
| Trailing whitespace | Minimal | `text··` → `text` |
| Multiple spaces | Standard | `too····many` → `too many` |
| Tabs to spaces | Standard | `→item` → `··item` |
| Common indentation | Aggressive | Removes leading indent from all lines |

### Lists

| Rule | Preset | Example |
|------|--------|---------|
| List markers | Standard | `* item` → `- item` |
| Checkboxes | Standard | `- [] task` → `- [ ] task` |
| Empty list items | Standard | `- ` (empty) → removed |
| Broken indentation | Standard | `········- item` → `··- item` |
| Ordered list numbers | Standard | `1. 1. 1.` → `1. 2. 3.` |

### Formatting

| Rule | Preset | Example |
|------|--------|---------|
| Link spaces | Standard | `[text] (url)` → `[text](url)` |
| Smart quotes | Aggressive | `"curly"` → `"straight"` |
| Emphasis style | Aggressive | `_italic_` → `*italic*` |
| Horizontal rules | Aggressive | `***` → `---` |
| Dedupe horizontal rules | Aggressive | `---`,`---`,`---` → `---` |

### Headings

| Rule | Preset | Example |
|------|--------|---------|
| Heading spaces | Standard | `##Title` → `## Title` |
| Fix heading level gaps | Aggressive | `# H1` → `### H3` becomes `## H3` |

### Code

| Rule | Preset | Example |
|------|--------|---------|
| HTML entities | Aggressive | `&amp;` → `&` |
| HTML to Markdown | Aggressive | `<b>text</b>` → `**text**` |
| Code fences | Aggressive | `~~~` → ` ``` ` |

### Block Elements

| Rule | Preset | Example |
|------|--------|---------|
| Block quotes | Aggressive | `>text` → `> text` |

### Obsidian-specific

| Rule | Preset | Example |
|------|--------|---------|
| Tag case | Aggressive | `#Tag` → `#tag` |

## Settings

- **Clean on save**: Automatically clean when saving files
- **Preset**: Choose Minimal, Standard, Aggressive, or Custom
- **Individual rules**: Toggle each rule when in Custom mode

## Development

```bash
npm install          # Install dependencies
npm run dev          # Build in watch mode
npm run build        # Production build
npm run test         # Run tests
```

## License

MIT
