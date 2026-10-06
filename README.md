# workflow
Claude Code plugin (same shape as ponytail). Every session start it loads a small per-project context: open windows plus the last 20 changes. Claude is told to run `log.sh "summary"` after each change. Hard-capped (~38 lines), oldest entries dropped.

Install once per device, works in every repo with no per-repo setup:
```
/plugin marketplace add BlueMeridian4/workflow
/plugin install workflow@workflow
```
Context lives in `~/.claude/workflow/<project>.md` (outside repos, never committed). Needs `wmctrl` (X11) for the window snapshot; without it the log still works.
