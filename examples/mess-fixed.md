Future Features to Consider

Based on common markdown pain points from pasted content:

High-Value (Frequent Problems)

1. Fix broken nested list indentation
  - Problem: Pasted content often has 2-space or 3-space indentation instead of consistent tabs/4-spaces
  - Solution: Normalize to Obsidian's standard indentation
- Parent
  - Child (2 spaces)    →    - Parent
                                 - Child (tab)
2. Clean up pasted HTML artifacts
  - &nbsp; → regular space
  - &amp; → &
  - <br> → newline
  - Strip remaining HTML tags
3. Fix broken links
  - [text] (url) → [text](url) (remove space)
  - Detect and fix URL-encoded spaces in links
4. Heading cleanup
  - Remove blank lines before/after headings
  - Ensure exactly one blank line after headings
  - Fix #heading → # heading (missing space)

Medium-Value (Quality of Life)

5. Smart paste mode
  - Auto-detect and clean content on paste (like Linter's paste rules)
  - Toggle in settings
6. Table formatting
  - Align table columns
  - Fix broken table syntax from copy-paste
7. Checkbox normalization
  - - [] → - [ ] (add space in empty checkbox)
  - - [X] → - [x] (lowercase x)
8. Code block cleanup
  - Remove trailing whitespace inside code blocks
  - Normalize fence style (``` vs ~~~)

Nice-to-Have

9. Settings page
  - Enable/disable individual rules
  - "Auto-clean on paste" toggle
  - "Auto-clean on save" toggle
10. Undo support
  - Currently Obsidian's native undo should work, but could add explicit "Revert last cleanup" command
11. Selection mode
  - Clean only selected text (you chose "entire document" but this could be optional)
12. AI-powered cleanup (stretch goal)
  - Use local LLM to fix semantic issues like broken sentences, weird line breaks mid-paragraph