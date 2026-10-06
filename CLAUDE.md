# Workflow rules
- At session start, read `CONTEXT.md` (open apps + recent changes).
- After each meaningful change/iteration, run `./log.sh "<one-line summary>"`. Keep entries under ~100 chars.
- Never hand-edit CONTEXT.md or grow it past the caps in log.sh (MAX_LOG, MAX_WIN); the script trims it.
