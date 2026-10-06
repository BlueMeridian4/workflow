---
description: Slim the current diff (ponytail review, then apply cuts)
---
Invoke the ponytail:ponytail-review skill on the current diff (`git diff main...HEAD` plus uncommitted). Apply every cut it finds, re-run linters/tests, and list lines removed. $ARGUMENTS
