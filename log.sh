#!/usr/bin/env bash
# Usage: log.sh "what changed" | log.sh (refresh snapshot only) | log.sh --path
# Context lives outside the repo (~/.claude/workflow/<project>.md): per-project, never committed.
MAX_LOG=${MAX_LOG:-20}   # hard cap on log entries; oldest dropped
MAX_WIN=${MAX_WIN:-15}   # hard cap on windows listed
root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
f=${CONTEXT:-$HOME/.claude/workflow/$(echo "$root" | tr / -).md}
[ "$1" = --path ] && { echo "$f"; exit; }
mkdir -p "$(dirname "$f")"
old=$(sed -n '/^## Log/,$p' "$f" 2>/dev/null | grep '^- ')
{
  echo "# Context: $root (~$((MAX_LOG+MAX_WIN+3)) lines max)"
  echo "## Open now ($(date '+%F %H:%M'), $(hostname))"
  # ponytail: wmctrl = X11 window titles only (active browser tab, not all tabs)
  wmctrl -l 2>/dev/null | awk '{$1=$2=$3=""; print substr($0,4,80)}' | grep -v '^Desktop Icons' | head -n "$MAX_WIN" | sed 's/^/- /'
  echo "## Log"
  { echo "$old"; [ -n "$1" ] && echo "- $(date '+%m-%d %H:%M') $1"; } | grep . | tail -n "$MAX_LOG"
} > "$f.tmp" && mv "$f.tmp" "$f"
