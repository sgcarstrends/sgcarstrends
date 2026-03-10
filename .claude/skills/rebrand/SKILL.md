---
name: rebrand
description: "Temporary skill to guide the rebrand from SG Cars Trends / @sgcarstrends to MotorMetrics / @motormetrics. Delete after rebranding is complete."
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Rebrand: SG Cars Trends → MotorMetrics

**Tracking issue:** #749

## Brand Mapping Reference

| Category | Old | New |
|----------|-----|-----|
| Display name | SG Cars Trends | MotorMetrics |
| npm scope | `@sgcarstrends/*` | `@motormetrics/*` |
| Domain | `sgcarstrends.com` | TBD |
| Env var prefix | `SG_CARS_TRENDS_*` | `MOTORMETRICS_*` |
| GitHub org | `sgcarstrends` | `motormetrics` |

---

## Phase 1 — Package Names & Imports

**Scope:** ~265 files, ~478 occurrences

### Find affected files

```bash
grep -r "@sgcarstrends/" --include="*.ts" --include="*.tsx" --include="*.json" -l .
```

### Replacement patterns

| Pattern | Replacement |
|---------|-------------|
| `@sgcarstrends/database` | `@motormetrics/database` |
| `@sgcarstrends/ui` | `@motormetrics/ui` |
| `@sgcarstrends/utils` | `@motormetrics/utils` |
| `@sgcarstrends/types` | `@motormetrics/types` |
| `@sgcarstrends/ai` | `@motormetrics/ai` |
| `@sgcarstrends/logos` | `@motormetrics/logos` |
| `@sgcarstrends/web` | `@motormetrics/web` |
| `@sgcarstrends/mcp` | `@motormetrics/mcp` |
| `@sgcarstrends/docs` | `@motormetrics/docs` |

### Steps

1. Update every `package.json` `name` field
2. Update all import/require statements across `.ts`, `.tsx` files
3. Update `pnpm-workspace.yaml` catalog entries
4. Update `tsconfig.json` path aliases in all packages
5. Update `turbo.json` pipeline references
6. Run `pnpm install` to regenerate lockfile
7. Verify: `pnpm build && pnpm test && pnpm lint`

---

## Phase 2 — Display Text & Site Config

**Scope:** ~48 files, ~60 occurrences

### Find affected files

```bash
grep -ri "SG Cars Trends" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" -l .
```

### Key files to update

- `apps/web/src/app/layout.tsx` — metadata title, description
- `apps/web/next.config.ts` — site config
- `apps/web/public/manifest.json` — PWA name
- `packages/ai/src/config.ts` — AI generation prompts
- Social media templates in `src/lib/workflows/`
- Footer components
- OpenGraph image generation

### Steps

1. Replace all display text "SG Cars Trends" → "MotorMetrics"
2. Update SEO metadata (title templates, descriptions)
3. Update AI blog generation system prompts
4. Update social media notification templates
5. Verify: `grep -ri "SG Cars Trends" .` returns no results

---

## Phase 3 — Domain & Security Config

**Scope:** ~36 files, ~50 occurrences — **blocked on new domain**

### Find affected files

```bash
grep -r "sgcarstrends\.com" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yml" -l .
```

### Steps

1. Replace `sgcarstrends.com` with new domain in all source files
2. Update CORS and CSP headers
3. Update `robots.txt` and sitemap generation
4. Update canonical URLs
5. Update MCP server client base URL (`apps/mcp/src/client.ts`)
6. Configure 301 redirects from old domain
7. Verify: `grep -r "sgcarstrends\.com" .` returns no results

---

## Phase 4 — Documentation

**Scope:** ~40 files

### Find affected files

```bash
grep -ri "sgcarstrends" --include="*.md" -l .
```

### Steps

1. Update root `CLAUDE.md`
2. Update all component `CLAUDE.md` files
3. Update all `README.md` files
4. Update `docs/architecture/*.md` diagrams
5. Update skill files in `.claude/skills/`
6. Update memory files
7. Verify: `grep -ri "sgcarstrends" --include="*.md" .` returns no results

---

## Phase 5 — CI/CD

### Steps

1. Rename `SG_CARS_TRENDS_API_TOKEN` → `MOTORMETRICS_API_TOKEN` in GitHub Actions
2. Update `.github/workflows/*.yml` references
3. Update Vercel environment variables (manual step)
4. Update npm publish config for `@motormetrics` scope
5. Verify: all CI checks pass

---

## Phase 6 — External Services

Manual steps — track in issue #749:

1. Create `motormetrics` GitHub org
2. Register `@motormetrics` npm scope
3. Configure DNS for new domain
4. Update Vercel project settings
5. Update social media accounts
6. Set up SEO redirects

---

## Post-Rebrand Verification

Run these commands to confirm no references remain:

```bash
# Check for any remaining @sgcarstrends references
grep -r "@sgcarstrends" --include="*.ts" --include="*.tsx" --include="*.json" .

# Check for display name references
grep -ri "SG Cars Trends" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" .

# Check for domain references
grep -r "sgcarstrends\.com" .

# Check for env var references
grep -r "SG_CARS_TRENDS" --include="*.ts" --include="*.tsx" --include="*.yml" --include="*.json" .

# Build, test, lint
pnpm build && pnpm test && pnpm lint
```

---

## Cleanup

After rebrand is fully complete:

1. Delete this skill: `rm -rf .claude/skills/rebrand/`
2. Remove `"Skill(rebrand)"` from `.claude/settings.local.json` permissions
3. Close issue #749
