#!/usr/bin/env bash
# Refresh the window snapshot, then print context + rule (stdout becomes session context).
d=$(cd "$(dirname "$0")/.." && pwd)
"$d/log.sh"
echo "## workflow context for this project (auto-loaded; do not hand-edit)"
cat "$("$d/log.sh" --path)"
echo "Rule: after each meaningful change/iteration, run \`$d/log.sh \"<one-line summary, <100 chars>\"\`."
