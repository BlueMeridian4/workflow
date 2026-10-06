#!/usr/bin/env bash
# Run inside any repo: ~/.workflow/bootstrap.sh
# First run on a new device (clones this repo to ~/.workflow):
#   gh repo clone BlueMeridian4/workflow ~/.workflow && ~/.workflow/bootstrap.sh
set -e
W=$(cd "$(dirname "$0")" && pwd)
command -v wmctrl >/dev/null || echo "note: install wmctrl (sudo apt install wmctrl) for the open-windows snapshot"
[ "$PWD" = "$W" ] && { echo "run this inside another repo"; exit 1; }
grep -qs 'workflow/log.sh' CLAUDE.md || cat >> CLAUDE.md <<RULES

# Workflow context
- At session start, read \`CONTEXT.md\` (open apps + recent changes).
- After each meaningful change, run \`~/.workflow/log.sh "<one-line summary, <100 chars>"\`.
- Never hand-edit CONTEXT.md; the script caps its length.
RULES
# CONTEXT.md holds window titles (mail subjects etc.), keep it out of git
grep -qxs 'CONTEXT.md' .gitignore || echo 'CONTEXT.md' >> .gitignore
"$W/log.sh" "bootstrapped workflow context"
echo "done: $PWD"
