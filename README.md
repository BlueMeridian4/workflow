# workflow
Per-project context for AI-assisted engineering: open windows plus the last 20 changes, in one capped markdown file (~38 lines, oldest dropped). One dependency-free file, `log.js` (Node), on Linux/Mac/Windows. Context lives in `~/.claude/workflow/<project>.md`, outside repos, never committed.

## Install (new device)
```
git clone https://github.com/BlueMeridian4/workflow ~/.workflow && ~/.workflow/install.sh
```
Idempotent. It adds shell shortcuts (`wf-help` lists them) to `~/.bash_aliases` and `~/.zshrc`, and installs the Claude Code plugin (auto-loads context every session, any repo). Windows: use Git Bash or WSL for now.

## Any other AI tool (Cursor, Codex, Gemini CLI, ...)
Clone to `~/.workflow`, then paste into the repo's `AGENTS.md` (or that tool's rules file):
```
At session start run `node ~/.workflow/log.js --session` and read the output (open apps + recent changes).
After each meaningful change run `node ~/.workflow/log.js "<one-line summary, <100 chars>"`.
```

Window snapshot: Linux `wmctrl` (X11), Mac `osascript`, Windows PowerShell. Mac/Windows untested. If it fails the log still works.

## Shortcuts
Run `wf-help` in a terminal for the list (source: `help.txt`). Shell: `wf-go`, `wf-plan`, `wf-lint`, `wf-lean`, `wf-review`, `wf-ship`, `wf-log`, `wf-ctx`. In Claude Code: `/workflow:go` etc. `lint` and `ship` run on a Haiku sub-agent to save tokens; `review` and `ship` never merge.

**Auto-fix hook:** after every Edit/Write the plugin runs `ruff --fix` (.py), `eslint --fix` (.js/.ts, if the project has eslint installed) or `shellcheck` (.sh) on that file and hands unfixable errors straight back to Claude.

**Rules:** copy `templates/rules.md` to `.claude/rules.md` in a repo and fill it in; `/workflow:plan` checks plans against it.
