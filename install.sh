#!/usr/bin/env bash
# Idempotent. New device: git clone https://github.com/BlueMeridian4/workflow ~/.workflow && ~/.workflow/install.sh
set -eu
W=$HOME/.workflow
[ -d "$W" ] || git clone -q https://github.com/BlueMeridian4/workflow "$W"
git -C "$W" pull -q --ff-only || echo "note: could not update $W"

line='[ -f ~/.workflow/env.sh ] && . ~/.workflow/env.sh'
for rc in "$HOME/.bash_aliases" "$HOME/.zshrc"; do
  # always create .bash_aliases (Ubuntu's .bashrc sources it); only touch .zshrc if it exists
  [ "$rc" = "$HOME/.bash_aliases" ] || [ -f "$rc" ] || continue
  grep -qsF "$line" "$rc" || printf '\n%s\n' "$line" >> "$rc"
done

if command -v claude >/dev/null; then
  claude plugin marketplace add BlueMeridian4/workflow >/dev/null 2>&1 || true
  claude plugin install workflow@workflow >/dev/null 2>&1 || echo "note: run /plugin install workflow@workflow inside Claude Code"
else
  echo "note: Claude Code not found; the aliases wl/wctx still work with any AI tool"
fi
command -v node >/dev/null || echo "note: install Node.js, log.js needs it"
command -v wmctrl >/dev/null || [ "$(uname)" != Linux ] || echo "note: sudo apt install wmctrl for the open-windows snapshot"

echo "Open a new shell, then run wf help:"
echo
cat "$W/help.txt"
