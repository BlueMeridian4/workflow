# Rules
Project rules that /workflow:plan and reviews check against. Keep short; one line each. Delete what doesn't apply.

## Code
- <conventions the linters can't enforce: naming, type-hint style, error handling>
- No silent `except`/`catch`; handle the specific error or re-raise with context.
- No new dependency without adding it to the manifest.

## Boundaries
- <which modules may import which; e.g. "core/ never imports from ui/">

## Safety
- Never log secrets or sensitive/personal data.
- <files or directories Claude must not read, edit or create>

## Verification
- <what must run after changing X; e.g. "after changing prompts.py, run the eval and compare">
