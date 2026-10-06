---
description: Lint, commit, push a branch, open a PR
---
1. Run /workflow:lint until clean. 2. If on main, create a short branch. 3. Commit with a one-line message. 4. Push and `gh pr create --fill` ($ARGUMENTS as extra notes). 5. Print the PR URL. Never merge; main is gated and merging is the human's call.
