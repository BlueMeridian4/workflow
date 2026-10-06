# shellcheck shell=bash
# Workflow shortcuts. Sourced from your shell rc by install.sh (bash and zsh).
wl()     { node ~/.workflow/log.js "$@"; }        # wl "did X": log a change
wctx()   { node ~/.workflow/log.js --session; }   # print current context (any AI tool)
wgo()    { claude "/workflow:go $*"; }
wlint()  { claude "/workflow:lint $*"; }
wlean()  { claude "/workflow:lean $*"; }
wreview() { claude "/workflow:review $*"; }       # wreview 12
wship()  { claude "/workflow:ship $*"; }
