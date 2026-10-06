# workflow
Per-project context for AI-assisted engineering: open windows plus the last 20 changes, in one capped markdown file (~38 lines, oldest dropped). One dependency-free file, `log.js` (Node), on Linux/Mac/Windows. Context lives in `~/.claude/workflow/<project>.md`, outside repos, never committed.

## Install (new device)
```
git clone https://github.com/BlueMeridian4/workflow ~/.workflow && ~/.workflow/install.sh
```
Idempotent. It puts the `wf` command on your PATH (via `~/.bash_aliases` and `~/.zshrc`, with Tab completion; run `wf help`), and installs the Claude Code plugin (auto-loads context every session, any repo). Windows: use Git Bash or WSL for now.

## Any other AI tool (Cursor, Codex, Gemini CLI, ...)
Clone to `~/.workflow`, then paste into the repo's `AGENTS.md` (or that tool's rules file):
```
At session start run `node ~/.workflow/log.js --session` and read the output (open apps + recent changes).
After each meaningful change run `node ~/.workflow/log.js "<one-line summary, <100 chars>"`.
```

Window snapshot: Linux `wmctrl` (X11), Mac `osascript`, Windows PowerShell. Mac/Windows untested. If it fails the log still works.

## Commands
One command, `wf`: `wf help`, `log`, `decide`, `board`, `ctx`, `go`, `plan`, `lint`, `lean`, `review [PR#]`, `ship` (source of the list: `help.txt`). In Claude Code the same tasks are `/workflow:go` etc. `lint` and `ship` run on a Haiku sub-agent to save tokens; `review` and `ship` never merge. Windows: add `%USERPROFILE%\.workflow\bin` to PATH (`wf.cmd` is included; untested).

**Auto-fix hook:** after every Edit/Write the plugin runs `ruff --fix` (.py), `eslint --fix` (.js/.ts, if the project has eslint installed) or `shellcheck` (.sh) on that file and hands unfixable errors straight back to Claude.

**Rules:** copy `templates/rules.md` to `.claude/rules.md` in a repo and fill it in; `/workflow:plan` checks plans against it.

**Decisions board:** Claude records each non-trivial choice with `wf decide "choice" "benefit" "cost"` (the session rule tells it to). `wf board` opens a small self-refreshing window (Chrome app mode if installed, else your default browser) showing the last 15 decisions and recent changes, so you can keep it on a side monitor instead of scrolling the terminal. Tip: right-click its title bar and pick "Always on top" if your desktop offers it.
