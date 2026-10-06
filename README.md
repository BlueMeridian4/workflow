# workflow
Low-setup context tracking for me + AI assistants. `./log.sh "msg"` rewrites `CONTEXT.md`: a snapshot of open windows plus the last 20 changes (hard cap, oldest dropped), so an AI catches up in ~40 lines. `CLAUDE.md` tells Claude Code to read and update it.

Needs `wmctrl` (X11). Track another repo: `CONTEXT=/path/CONTEXT.md ./log.sh "msg"`.

**New device/repo:** `gh repo clone BlueMeridian4/workflow ~/.workflow`, then run `~/.workflow/bootstrap.sh` inside any repo. It adds the rules to that repo's `CLAUDE.md`, gitignores `CONTEXT.md` (it contains window titles), and logs once. Safe to re-run.
