---
description: Review a PR (or current branch) before merging; never merges
---
Invoke the code-review skill on PR/branch "$ARGUMENTS" (default: current branch vs main). Report findings ranked by severity, one line each. Do not merge or approve; that is the human's call.
Then record a board summary: `wf pr "<PR ref>" "<one-line tl;dr of the change, <100 chars>" "<top finding, or empty if none>"`.
