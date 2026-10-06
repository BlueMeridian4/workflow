# shellcheck shell=bash
# Workflow shortcuts (wf-*). Sourced from your shell rc by install.sh (bash and zsh). Run wf-help.
wf-help()   { cat ~/.workflow/help.txt; }
wf-log()    { node ~/.workflow/log.js "$@"; }        # wf-log "did X"
wf-ctx()    { node ~/.workflow/log.js --session; }
wf-go()     { claude "/workflow:go $*"; }
wf-plan()   { claude "/workflow:plan $*"; }
wf-lint()   { claude "/workflow:lint $*"; }
wf-lean()   { claude "/workflow:lean $*"; }
wf-review() { claude "/workflow:review $*"; }        # wf-review 12
wf-ship()   { claude "/workflow:ship $*"; }
