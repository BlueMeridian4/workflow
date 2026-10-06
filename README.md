# workflow
Per-project context for AI-assisted engineering: open windows plus the last 20 changes, in one capped markdown file (~38 lines, oldest dropped). One dependency-free file, `log.js` (Node), on Linux/Mac/Windows. Context lives in `~/.claude/workflow/<project>.md`, outside repos, never committed.

## Claude Code (auto-loaded every session, any repo)
```
/plugin marketplace add BlueMeridian4/workflow
/plugin install workflow@workflow
```

## Any other AI tool (Cursor, Codex, Gemini CLI, ...)
Clone to `~/.workflow`, then paste into the repo's `AGENTS.md` (or that tool's rules file):
```
At session start run `node ~/.workflow/log.js --session` and read the output (open apps + recent changes).
After each meaningful change run `node ~/.workflow/log.js "<one-line summary, <100 chars>"`.
```

Window snapshot: Linux `wmctrl` (X11), Mac `osascript`, Windows PowerShell. Mac/Windows untested. If it fails the log still works.
