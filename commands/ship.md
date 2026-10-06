---
description: Lint, commit, push a branch, open a PR (Haiku sub-agent)
---
Spawn one Agent (`subagent_type: "general-purpose"`, `model: "haiku"`) with these instructions verbatim, then relay its report as-is.

1. Run the repo's linters until clean (as /workflow:lint: scope to changed files, no `--unsafe-fixes`, no disabled rules). If anything remains, report it and stop; do not commit.
2. `git status --short`; if nothing to commit, say so and stop.
3. If on main, create a short branch name from the diff. Never commit to main.
4. `git add -u` plus new files that belong to the change (never secrets or generated files). Commit with a one-line subject (<=72 chars) from the actual diff, matching `git log --oneline -5` style.
5. `git push -u origin HEAD`, then `gh pr create --fill`. Extra notes for the PR body: $ARGUMENTS
6. Report branch, commit hash, PR URL. Never merge; main is gated and merging is the human's call.
