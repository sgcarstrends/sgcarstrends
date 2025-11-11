# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Access

When working with external libraries or frameworks, use the Context7 MCP tools to get up-to-date documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID for any package
2. Use `mcp__context7__get-library-docs` to retrieve comprehensive documentation and examples

This ensures you have access to the latest API documentation for dependencies like Hono, Next.js, Drizzle ORM, Vitest,
and others used in this project.

# SG Cars Trends - Developer Reference Guide

## Project-Specific CLAUDE.md Files

This repository includes directory-specific CLAUDE.md files with detailed guidance for each component:

- **[apps/api/CLAUDE.md](apps/api/CLAUDE.md)**: API service development with Hono, workflows, tRPC, and social media
  integration
- **[apps/web/CLAUDE.md](apps/web/CLAUDE.md)**: Web application development with Next.js 16, HeroUI, blog features, and
  analytics
- **[packages/database/CLAUDE.md](packages/database/CLAUDE.md)**: Database schema management with Drizzle ORM,
  migrations, and TypeScript integration
- **[packages/ui/CLAUDE.md](packages/ui/CLAUDE.md)**: Shared UI components library with shadcn/ui and Tailwind CSS
- **[infra/CLAUDE.md](infra/CLAUDE.md)**: Infrastructure configuration with SST v3, AWS deployment, and domain
  management

Refer to these files for component-specific development guidance and best practices.

## Architecture Documentation

Comprehensive system architecture documentation with visual diagrams is available in the Mintlify documentation site:

- **[apps/docs/architecture/](apps/docs/architecture/)**: Complete architecture documentation with Mermaid diagrams
    - **[system.md](apps/docs/architecture/system.md)**: System architecture overview and component relationships
    - **[workflows.md](apps/docs/architecture/workflows.md)**: Data processing workflow sequence diagrams
    - **[database.md](apps/docs/architecture/database.md)**: Database schema and entity relationships
    - **[api.md](apps/docs/architecture/api.md)**: API architecture with Hono framework structure
    - **[infrastructure.md](apps/docs/architecture/infrastructure.md)**: AWS deployment topology and domain strategy
    - **[social.md](apps/docs/architecture/social.md)**: Social media integration workflows

- **[apps/docs/diagrams/](apps/docs/diagrams/)**: Source Mermaid diagram files (`.mmd` format)

These architectural resources provide visual understanding of system components, data flows, and integration patterns
for effective development and maintenance.

# SG Cars Trends Platform - Overview

## Project Overview

SG Cars Trends is a full-stack platform providing access to Singapore vehicle registration data and
Certificate of Entitlement (COE) bidding results. The monorepo includes:

- **API Service**: RESTful endpoints for accessing car registration and COE data (Hono framework)
- **Web Application**: Next.js 16 frontend with Cache Components, component co-location, interactive charts, analytics,
  and blog functionality
- **Integrated Updater**: Workflow-based data update system with scheduled jobs that fetch and process data from LTA
  DataMall (QStash workflows)
- **LLM Blog Generation**: Automated blog post creation using Vercel AI SDK with Google Gemini to analyse market data
  and generate insights
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter when new data is available
- **Documentation**: Comprehensive developer documentation using Mintlify

## Commands

All commands use pnpm as the package manager.

### Build & Development

- `pnpm build` - Build all packages
- `pnpm dev` - Start all development servers
- `pnpm start:web` - Start production web server

### Testing

- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage reports
- `pnpm -F <package> test -- <path>` - Run specific test

### Linting

- `pnpm lint` - Lint all packages (Biome)
- `pnpm format` - Format all packages (Biome)

### Database

- `pnpm db:migrate` - Run migrations
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema changes

### Documentation

- `pnpm docs:dev` - Start documentation dev server
- `cd apps/docs && pnpm mintlify broken-links` - Check broken links

### Deployment

- `pnpm deploy:dev` - Deploy all to development
- `pnpm deploy:staging` - Deploy all to staging
- `pnpm deploy:prod` - Deploy all to production
- `pnpm deploy:<service>:<env>` - Deploy specific service (api/web) to environment

### Release

- Automated via GitHub Actions on main branch push
- Uses semantic-release with conventional commits
- Manual dry-run: `npx semantic-release --dry-run`

*See component CLAUDE.md files for service-specific commands and workflows.*

## Code Structure

- **apps/api**: Unified API service using Hono framework with integrated updater workflows
    - **src/v1**: API endpoints for data access
    - **src/lib/workflows**: Workflow-based data update system and social media integration
    - **src/lib/gemini**: LLM blog generation using Vercel AI SDK with Google Gemini
    - **src/routes**: API route handlers including workflow endpoints
    - **src/config**: Database, Redis, QStash, and platform configurations
    - **src/trpc**: Type-safe tRPC router with authentication
- **apps/web**: Next.js frontend application
    - **src/app**: Next.js App Router pages and layouts with blog functionality
    - **src/components**: React components with comprehensive tests
    - **src/actions**: Server actions for blog and analytics functionality
    - **src/utils**: Web-specific utility functions
- **apps/admin**: Administrative interface for content management (unreleased)
- **apps/docs**: Mintlify documentation site
    - **architecture/**: Complete system architecture documentation with Mermaid diagrams
    - **diagrams/**: Source Mermaid diagram files for architecture documentation
- **packages/database**: Database schema and migrations using Drizzle ORM
    - **src/db**: Schema definitions for cars, COE, posts, and analytics tables
    - **migrations**: Database migration files with version tracking
- **packages/logos**: Car logo management with Vercel Blob storage
    - **src/services/logo**: Core logo fetching, listing, and downloading functions
    - **src/infra/storage**: Vercel Blob service with Redis caching
    - **src/utils**: Brand name normalization utilities
- **packages/types**: Shared TypeScript type definitions
- **packages/ui**: Shared UI component library with shadcn/ui and Tailwind CSS
    - **src/components**: shadcn/ui components (badge, button, card, dialog, etc.)
    - **src/hooks**: Custom React hooks (use-mobile)
    - **src/lib**: Utility functions (cn helper for class merging)
    - **src/styles**: Global CSS styles and Tailwind configuration
- **packages/utils**: Shared utility functions and Redis configuration
- **infra**: SST v3 infrastructure configuration for AWS deployment

## Monorepo Build System

The project uses Turbo for efficient monorepo task orchestration:

- **Dependency-aware**: Tasks run in dependency order with automatic topological sorting
- **Caching**: Intelligent build output caching with file-based invalidation
- **Parallel execution**: Independent tasks run concurrently
- **Environment handling**: Loose mode with global `.env`, `tsconfig.json`, `NODE_ENV` dependencies
- **Development tasks**: `dev` and `test:watch` use persistent mode with cache disabled
- **TUI Interface**: Enhanced terminal interface for better development experience

## Dependency Management

The project uses **pnpm with catalog** for centralised dependency version management:

- Shared versions defined in `pnpm-workspace.yaml`
- Workspace packages reference with `"package": "catalog:"`
- Root-level CLI tools (SST, Turbo, Biome) available to all workspace packages
- Ensures version consistency and simplifies upgrades

## Code Style

### TypeScript

- Strict type checking enabled (noImplicitAny, strictNullChecks)
- Avoid `any` type - prefer `unknown` with type guards
- Use workspace imports: `@sgcarstrends/database`, `@sgcarstrends/ui`, `@sgcarstrends/utils`, `@sgcarstrends/types`

### Biome

- Used for formatting, linting, and import organisation
- 2 spaces indentation, automatic import sorting
- Git-aware file processing with `.gitignore` support
- Workspace-specific configs extend root configuration

### Naming Conventions

- Functions/variables: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_CASE`
- **Files**: Avoid redundant prefixes (✅ `cars/make.ts` not ❌ `cars/cars-make.ts`)
- Import groups: 1) built-in, 2) external, 3) internal

### Commit Messages

Follow conventional commit format (enforced by commitlint):

- `feat: description` (minor bump) / `fix: description` (patch bump)
- `feat!: description` or `BREAKING CHANGE:` (major bump)
- `chore:`, `docs:`, `refactor:`, `test:` (no bump)
- **Keep SHORT**: 50 chars preferred, 72 max
- **Optional scopes**: `feat(api):`, `fix(web):`, `chore(database):`
- Available scopes: `api`, `web`, `docs`, `database`, `types`, `ui`, `utils`, `infra`, `deps`, `release`

### Other

- Error handling: try/catch with specific error types
- Spelling: English (Singapore)

## Git Hooks

The project uses Husky v9+ with automated git hooks:

- **Pre-commit**: `lint-staged` runs `pnpm biome check --write` on staged files
- **Commit-msg**: `commitlint` validates conventional commit format
- Failed hooks prevent commits with clear error messages
- Bypass with `git commit -n` (not recommended)

## Testing

- Framework: Vitest with V8 coverage
- Location: `__tests__` directories next to implementation
- File suffix: `.test.ts`
- Best practices: High coverage, mock external APIs, test happy and error paths
- Component tests: Focus on functionality over implementation

## Environment Variables

Core cross-cutting variables:

- `DATABASE_URL` - PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Redis configuration

*See component CLAUDE.md files for service-specific environment variables.*

## Deployment

- **Platform**: AWS via SST framework
- **Region**: ap-southeast-1 (Singapore)
- **Architecture**: arm64
- **DNS**: Cloudflare
- **Domains**: sgcarstrends.com with environment subdomains

*See [infra/CLAUDE.md](infra/CLAUDE.md) for detailed infrastructure configuration.*

## Domain Convention

- **API**: `<service>.<environment>.sgcarstrends.com` (e.g., `api.sgcarstrends.com`)
- **Web**: `<environment>.sgcarstrends.com` with apex for production (e.g., `sgcarstrends.com`)
- **DNS**: Cloudflare with automatic SSL
- **New backend services**: Use service subdomain pattern

## Data Models

PostgreSQL with Drizzle ORM using **snake_case** column naming:

- `cars`, `coe`, `coePQP`, `posts`, `analyticsTable`

*See [packages/database/CLAUDE.md](packages/database/CLAUDE.md) for detailed schemas and migrations.*

## Shared Packages

- **`@sgcarstrends/database`**: Drizzle ORM schemas and migrations
- **`@sgcarstrends/types`**: Shared TypeScript interfaces
- **`@sgcarstrends/ui`**: Shared UI component library with shadcn/ui, Radix UI primitives, and Tailwind CSS
- **`@sgcarstrends/utils`**: Utility functions and centralised Redis client
- **`@sgcarstrends/logos`**: Car logo management with Vercel Blob storage, automatic scraping, Redis caching, and brand name normalization

*See component CLAUDE.md files for architecture details (workflows, blog generation, social media integration).*

## Release Process

Automated via semantic-release:
- Triggered on main branch push via GitHub Actions
- Unified versioning with "v" prefix (v1.0.0, v1.1.0, v2.0.0)
- Auto-generated changelog and GitHub releases

## GitHub Actions

**Active workflows:**
- `release.yml` - Automated releases on main branch
- `deploy-staging.yml` / `deploy-prod.yml` - Environment deployments
- `run-migrations.yml` / `test.yml` - Reusable workflows

**Disabled workflows:** `deploy-pr.yml`, `cleanup-pr.yml` (skip unless re-enabling)

## Contribution Guidelines

- Create feature branches from main
- Use conventional commit messages (see Code Style section)
- Ensure CI passes (tests, lint, typecheck)
- Use GitHub issue templates when available
- Maintain backward compatibility for public APIs

## Documentation Maintenance

### Documentation Structure

- **Root CLAUDE.md**: Monorepo-wide guidelines, structure, tooling, cross-cutting concerns
- **Component CLAUDE.md**: `apps/*/CLAUDE.md`, `packages/*/CLAUDE.md` - component-specific implementation details
- **README.md**: Package setup, usage instructions, user-facing features
- **Architecture docs**: `apps/docs/architecture/*.md` - system design with Mermaid diagrams

### Update Guidelines

**Update root CLAUDE.md for:**
- New apps/packages, dependency management changes
- Monorepo build system, git hooks, code style changes
- Cross-cutting commands, environment variables, deployment patterns
- Domain conventions, infrastructure changes

**Update component CLAUDE.md for:**
- API endpoints, workflows, tRPC, social media integration (`apps/api/CLAUDE.md`)
- Pages, routes, blog features, analytics, HeroUI components (`apps/web/CLAUDE.md`)
- Schema changes, migrations, Drizzle config (`packages/database/CLAUDE.md`)
- UI components, shadcn/ui patterns, Tailwind config (`packages/ui/CLAUDE.md`)
- SST config, AWS resources, domain management (`infra/CLAUDE.md`)

**Update README.md for:**
- User-facing features, setup instructions, tech stack changes

**Update architecture docs for:**
- System architecture changes, data flow modifications
- Update Mermaid diagrams in `apps/docs/diagrams/` accordingly

**Rule of thumb:** Component-specific changes → component docs. Cross-cutting changes → root docs. When in doubt, update it.
