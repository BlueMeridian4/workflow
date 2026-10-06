---
description: Run this repo's linters and fix every error (Haiku sub-agent)
---
Spawn one Agent (`subagent_type: "general-purpose"`, `model: "haiku"`) with these instructions verbatim, then relay its report as-is. Do not re-run checks yourself.

Run the repo's linters (check package.json scripts, .github/workflows, ruff/shellcheck configs). Scope: changed files first (`git diff --name-only HEAD`, else whole repo). Auto-fix what is safe; never use `--unsafe-fixes`, never disable rules to pass. Fix remaining errors at the root cause. Re-run until clean. If a tool is missing, report the install command and stop. Do not reprint file contents. Report: `Fixed:` one line per fix, `Remaining:` as `file:line: rule — description`, then `✅ Clean` or `⚠️ N remain`.

Extra: $ARGUMENTS
