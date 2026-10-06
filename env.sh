# shellcheck shell=bash
# Sourced from your shell rc by install.sh (bash and zsh): puts `wf` on PATH and enables Tab completion.
export PATH="$HOME/.workflow/bin:$PATH"
if [ -n "${ZSH_VERSION:-}" ]; then
  compctl -k "(help log decide pr find board ctx go research plan lint lean review ship)" wf
else
  complete -W "help log decide pr find board ctx go research plan lint lean review ship" wf
fi
