---
name: conventional-commits
description: Format commit messages following project conventions with commitlint validation. Use when committing changes, writing PR descriptions, or preparing releases.
---

# Conventional Commits Skill

This project enforces conventional commits via `@commitlint/config-conventional` + Husky v9+.

## Commit Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types

| Type | Semver Bump | Usage |
|------|-------------|-------|
| `feat` | Minor | New feature |
| `fix` | Patch | Bug fix |
| `feat!` | **Major** | Breaking feature |
| `fix!` | **Major** | Breaking fix |
| `chore` | None | Maintenance, dependencies |
| `docs` | None | Documentation only |
| `refactor` | None | Code change (no feature/fix) |
| `test` | None | Adding/updating tests |
| `ci` | None | CI/CD changes |
| `perf` | None | Performance improvement |

## Scopes (Optional)

`api`, `web`, `database`, `types`, `ui`, `utils`, `infra`, `deps`, `release`

## Subject Rules

- Imperative mood ("add" not "added" or "adds")
- No period at end
- 50 characters preferred, 72 max
- Lowercase first letter

## Examples

```bash
# Feature
feat(web): add COE comparison chart

# Bug fix
fix(database): handle null month in query

# Breaking change
feat!: migrate HeroUI v2 to v3

BREAKING CHANGE: HeroUI v3 requires motion/react instead of framer-motion

# Dependencies
chore(deps): upgrade Next.js to v16.1

# Refactor
refactor: simplify car makes page

# Multiple changes (use body)
feat(web): add Redis sorted sets for makes filtering

Add sorted set caching for makes list to improve
query performance on the car registrations page.
```

## Git Hooks

- **pre-commit** (`.husky/pre-commit`): Runs `gitleaks protect --staged` then `pnpm lint-staged`
- **commit-msg** (`.husky/commit-msg`): Runs `pnpm commitlint --edit $1`

If commitlint rejects, check:
1. Type is valid (see table above)
2. Subject length is under 72 characters
3. Format matches `type(scope): subject`
4. Scope is from the allowed list (or omitted)

## Release Impact

semantic-release reads commit types to determine version bumps:
- `feat` → minor version bump (v4.46.0 → v4.47.0)
- `fix` → patch version bump (v4.46.0 → v4.46.1)
- `BREAKING CHANGE` footer or `!` suffix → major bump (v4.46.0 → v5.0.0)
- `chore`, `docs`, `refactor`, `test` → no release

## Related

- See `release-management` skill for release workflow
- See `changelog` skill for auto-generated changelogs
- Config: `.releaserc.json` (semantic-release), `@commitlint/config-conventional`
