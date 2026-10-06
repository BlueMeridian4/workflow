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

**Board:** `wf board [path]` opens (the current project, the given path, or, outside a repo, the most recently updated project) a small floating window (Chrome app mode if installed, else your browser) split in two, drag the divider to resize. Top: decisions Claude records with `wf decide "choice" "benefit" "cost"`, last 15. Bottom: review summaries (`wf pr "ref" "tl;dr" "flag"`, which `/workflow:review` runs for you), last 10, click one to see its flag. It updates in place every 3 seconds, so scroll position and open items stay put. Third pane, Research: `wf research [topic]` has Claude search the web for what other people and tools do and add 3-6 findings (`wf find "name" "what" "url" "take"`, last 12), each with a steal/maybe/skip take, so you can cherry-pick instead of reinventing. Tip: right-click its title bar and pick "Always on top" if your desktop offers it.
