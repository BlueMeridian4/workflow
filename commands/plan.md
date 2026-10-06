---
description: Reality-check a plan against repo rules before writing code
---
Check the plan in "$ARGUMENTS" (default: PLAN.md, else the plan just discussed) before any code is written. Read it, `CLAUDE.md` and `.claude/rules.md` (if present).
1. **Paths:** every file path mentioned exists, or is correctly marked as new, and sits in the right module/directory.
2. **Rules:** flag any step that violates a rule in CLAUDE.md or .claude/rules.md.
3. **Verification:** flag steps that change behavior with no test/eval/lint step after them, and vague steps ("improve", "update the pipeline") that name no file or function.
4. **Dependencies:** new packages used but not added to the manifest.
Output a numbered list: `[step] file/section — what's wrong — fix`. If none: "No issues found — plan is ready." Then, if issues exist, ask whether to fix the plan. Never edit it without a yes.
