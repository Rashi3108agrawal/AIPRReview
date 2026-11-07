# Git Workflow

Use short-lived branches and focused pull requests. Keep each change reviewable and run the relevant backend or frontend checks before requesting review.

## Branches

- Start feature work from the current integration branch.
- Use a descriptive name such as `feature/review-summary` or `fix/webhook-retry`.
- Rebase or merge updates according to the hosting team's policy.

## Commits

Write imperative, scoped subjects that summarize the change. Group related tests and documentation with the implementation they describe. Never commit secrets, generated build output, local environment files, or dependency caches.

## Pull requests

Describe the behavior and compatibility impact, list validation commands and outcomes, and call out any operational or migration requirements. Keep API and schema changes explicit and separately reviewable.
