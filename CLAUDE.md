# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Access

Automatically use Context7 for code generation and library documentation.

# SG Cars Trends - Developer Reference Guide

## Project-Specific CLAUDE.md Files

This repository includes directory-specific CLAUDE.md files with detailed guidance for each component:

### Applications

- **[apps/api/CLAUDE.md](apps/api/CLAUDE.md)**: REST API service development with Hono framework and OpenAPI documentation
- **[apps/web/CLAUDE.md](apps/web/CLAUDE.md)**: Web application development with Next.js 16, HeroUI, blog features,
  analytics, integrated admin interface at `/admin` path, and data updater workflows with social media integration

### Packages

- **[packages/ai/CLAUDE.md](packages/ai/CLAUDE.md)**: AI-powered blog generation with Vercel AI SDK, Google Gemini, and
  Langfuse telemetry
- **[packages/database/CLAUDE.md](packages/database/CLAUDE.md)**: Database schema management with Drizzle ORM,
  migrations, and TypeScript integration
- **[packages/logos/CLAUDE.md](packages/logos/CLAUDE.md)**: Car logo management with Vercel Blob storage, Redis caching,
  and brand normalisation
- **[packages/ui/CLAUDE.md](packages/ui/CLAUDE.md)**: Shared UI components library with shadcn/ui and Tailwind CSS

### Infrastructure

- **[infra/CLAUDE.md](infra/CLAUDE.md)**: Infrastructure configuration with SST v3, AWS deployment, and domain
  management

Refer to these files for component-specific development guidance and best practices.

## Architecture Documentation

System architecture documentation with Mermaid diagrams is available in the `docs/` directory:

- **[docs/architecture/](docs/architecture/)**: Architecture documentation with Mermaid diagrams
    - **[system.md](docs/architecture/system.md)**: System architecture overview
    - **[workflows.md](docs/architecture/workflows.md)**: Data processing workflow sequence diagrams
    - **[database.md](docs/architecture/database.md)**: Database schema and entity relationships
    - **[api.md](docs/architecture/api.md)**: API architecture with Hono framework
    - **[infrastructure.md](docs/architecture/infrastructure.md)**: AWS deployment topology
    - **[social.md](docs/architecture/social.md)**: Social media integration workflows

- **[docs/diagrams/](docs/diagrams/)**: Source Mermaid diagram files (`.mmd` format)

# SG Cars Trends Platform - Overview

## Project Overview

SG Cars Trends is a full-stack platform providing access to Singapore vehicle registration data,
Certificate of Entitlement (COE) bidding results, and vehicle deregistration statistics. The monorepo includes:

- **API Service**: RESTful endpoints for accessing car registration and COE data (Hono framework)
- **Web Application**: Next.js 16 frontend with Cache Components, component co-location, interactive charts, analytics,
  blog functionality, and integrated admin interface at `/admin` path. Also hosts the integrated data updater workflows.
- **Integrated Updater**: Workflow-based data update system with scheduled jobs that fetch and process data from LTA
  DataMall (QStash workflows). Consolidated into the web application for simplified deployment.
- **LLM Blog Generation**: Automated blog post creation using Vercel AI SDK with Google Gemini to analyse market data
  and generate insights. Runs within web application workflows.
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter when new data is available.
  Triggered by web application workflows.

## Commands

All commands use pnpm as the package manager.

| Category | Command | Description |
|----------|---------|-------------|
| **Build/Dev** | `pnpm build` | Build all packages |
| | `pnpm dev` | Start all development servers |
| | `pnpm start:web` | Start production web server |
| **Testing** | `pnpm test` | Run all tests (see `api-testing`, `e2e-testing`, `coverage-analysis` skills) |
| | `pnpm test:watch` | Run tests in watch mode |
| | `pnpm -F <package> test -- <path>` | Run specific test |
| **Linting** | `pnpm lint` | Lint all packages (see `biome-config` skill) |
| | `pnpm format` | Format all packages |
| **Database** | `pnpm db:migrate` | Run migrations (see `schema-design` skill) |
| | `pnpm db:generate` | Generate migrations |
| **Deployment** | See `sst-deployment` skill | Multi-environment deployment workflows |
| **Release** | See `release-management` skill | Automated releases with semantic-release |
| **Auth** | `pnpm auth:generate` | Generate authentication schema |

*See component CLAUDE.md files for service-specific commands and workflows.*

## Code Structure

- **apps/api**: REST API service using Hono framework
    - **src/v1**: API endpoints for data access
    - **src/features**: Feature modules (cars, coe, deregistrations, health, logos, months, posts, shared)
    - **src/lib**: Utility functions (health checks, date helpers)
    - **src/config**: Database and Redis configurations
- **apps/web**: Next.js frontend application with integrated workflows
    - **src/app**: Next.js App Router pages and layouts with blog functionality
    - **src/app/admin**: Integrated admin interface for content management
    - **src/app/api/workflows**: QStash workflow endpoints (cars, coe, deregistrations, trigger)
    - **src/lib/workflows**: Workflow-based data update system and social media integration
    - **src/components**: React components with comprehensive tests
    - **src/actions**: Server actions for maintenance and background tasks
    - **src/utils**: Web-specific utility functions
    - **src/queries**: Data fetching queries with comprehensive tests
    - **src/config**: Database, Redis, QStash, and platform configurations
- **packages/database**: Database schema and migrations using Drizzle ORM
    - **src/schema**: Schema definitions for cars, COE, deregistrations, and posts tables
    - **migrations**: Database migration files with version tracking
- **packages/ai**: AI-powered blog generation shared package
    - **src/generate-post.ts**: 2-step blog generation (analysis → structured output)
    - **src/config.ts**: System instructions and prompts for analysis and generation steps
    - **src/schemas.ts**: Zod schemas for structured output (postSchema, highlightSchema)
    - **src/tags.ts**: Tag constants and types (CARS_TAGS, COE_TAGS)
    - **src/hero-images.ts**: Hero image URLs and helpers
    - **src/queries.ts**: Database queries for data aggregation
    - **src/save-post.ts**: Post persistence with idempotency
    - **src/instrumentation.ts**: Langfuse telemetry setup
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
- **Variables**: Use descriptive names (✅ `record`, `result`, `item` not ❌ `p`, `d`, `r`, `i`)
- Import groups: 1) built-in, 2) external, 3) internal

### Commit Messages

Follow conventional commit format (enforced by commitlint):

- `feat: description` (minor bump) / `fix: description` (patch bump)
- `feat!: description` or `BREAKING CHANGE:` (major bump)
- `chore:`, `docs:`, `refactor:`, `test:` (no bump)
- **Keep SHORT**: 50 chars preferred, 72 max
- **Optional scopes**: `feat(api):`, `fix(web):`, `chore(database):`
- Available scopes: `api`, `web`, `database`, `types`, `ui`, `utils`, `infra`, `deps`, `release`

### Other

- Error handling: try/catch with specific error types
- Spelling: English (Singapore)

## Git Hooks

The project uses Husky v9+ with `lint-staged` and `commitlint`. See `conventional-commits` skill for commit message formatting and git workflows.

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

- **Platform**: AWS via SST framework (ap-southeast-1, arm64)
- **DNS**: Cloudflare with sgcarstrends.com domain

See `sst-deployment` skill for deployment workflows and [infra/CLAUDE.md](infra/CLAUDE.md) for infrastructure details.

## Domain Convention

- **API**: `<service>.<environment>.sgcarstrends.com` (e.g., `api.sgcarstrends.com`)
- **Web**: `<environment>.sgcarstrends.com` with apex for production (e.g., `sgcarstrends.com`)
- **New services**: Use service subdomain pattern

See `domain-management` skill for DNS configuration and routing details.

## Data Models

PostgreSQL with Drizzle ORM using **camelCase** column naming:

- `cars`, `coe`, `pqp`, `deregistrations`, `posts`

**Naming Strategy:**
- Table names: `snake_case` (e.g., `cars`, `coe`, `pqp`)
- Column names: `camelCase` (e.g., `vehicleClass`, `biddingNo`, `fuelType`)
- Core columns use `NOT NULL` constraints where appropriate
- Default values for numeric columns (e.g., `integer().default(0)`)

*See [packages/database/CLAUDE.md](packages/database/CLAUDE.md) for detailed schemas and migrations.*

## Shared Packages

- **`@sgcarstrends/ai`**: AI-powered blog generation with 2-step flow (analysis → structured output), Zod validation, hero images, tag constants, and Langfuse telemetry
- **`@sgcarstrends/database`**: Drizzle ORM schemas and migrations
- **`@sgcarstrends/types`**: Shared TypeScript interfaces
- **`@sgcarstrends/ui`**: Shared UI component library with shadcn/ui, Radix UI primitives, and Tailwind CSS
- **`@sgcarstrends/utils`**: Utility functions and centralised Redis client
- **`@sgcarstrends/logos`**: Car logo management with Vercel Blob storage, automatic scraping, Redis caching, and brand name normalization

*See component CLAUDE.md files for architecture details (workflows, blog generation, social media integration).*

## Release Process

Automated via semantic-release with unified "v" prefix versioning (v1.0.0, v1.1.0, v2.0.0). See `release-management` and `changelog` skills for release workflows.

## GitHub Actions

**Active**: `release.yml`, `deploy-staging.yml`, `deploy-prod.yml`, `run-migrations.yml`, `checks.yml`
**Reusable**: `test.yml` (called by other workflows)
**Disabled**: `deploy-pr.yml`, `cleanup-pr.yml`

See `github-actions` skill for workflow management and automation.

## Contribution Guidelines

- Create feature branches from main
- Use conventional commit messages (see Code Style section)
- Ensure CI passes (tests, lint, typecheck)
- Use GitHub issue templates when available
- Maintain backward compatibility for public APIs

## Documentation Maintenance

### Documentation Structure

- **Root CLAUDE.md**: Monorepo-wide guidelines, structure, tooling, cross-cutting concerns
- **Component CLAUDE.md**: Component-specific implementation (`apps/*/CLAUDE.md`, `packages/*/CLAUDE.md`)
- **README.md**: Package setup, usage instructions, user-facing features
- **docs/architecture/**: System architecture documentation with Mermaid diagrams

**Rule of thumb:** Component-specific changes → component docs. Cross-cutting changes → root docs.

See `readme-updates` and `mermaid-diagrams` skills for documentation workflows.
