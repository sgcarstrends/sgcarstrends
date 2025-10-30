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
- **Web Application**: Next.js 16 frontend with Cache Components, component co-location, interactive charts, analytics, and blog functionality
- **Integrated Updater**: Workflow-based data update system with scheduled jobs that fetch and process data from LTA
  DataMall (QStash workflows)
- **LLM Blog Generation**: Automated blog post creation using Vercel AI SDK with Google Gemini to analyse market data
  and generate insights
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter when new data is available
- **Documentation**: Comprehensive developer documentation using Mintlify

## Commands

### Common Commands

All commands use pnpm as the package manager:

**Build Commands:**

- Build all: `pnpm build`
- Build web: `pnpm build:web`
- Build admin: `pnpm build:admin`

**Development Commands:**

- Develop all: `pnpm dev`
- API dev server: `pnpm dev:api`
- Web dev server: `pnpm dev:web`
- Admin dev server: `pnpm dev:admin`

**Testing Commands:**

- Test all: `pnpm test`
- Test watch: `pnpm test:watch`
- Test coverage: `pnpm test:coverage`
- Test API: `pnpm test:api`
- Test web: `pnpm test:web`
- Run single test: `pnpm -F @sgcarstrends/api test -- src/utils/__tests__/slugify.test.ts`

**Linting Commands:**

- Lint all: `pnpm lint` (runs Biome across all workspace packages)
- Format all: `pnpm format` (runs Biome formatting)
- Lint API: `pnpm lint:api` (Biome check on API package)
- Lint web: `pnpm lint:web` (Biome check on web package)
- Lint admin: `pnpm lint:admin` (Biome check on admin package)

**Start Commands:**

- Start web: `pnpm start:web`

### Blog Commands

- View all blog posts: Navigate to `/blog` on the web application
- View specific blog post: Navigate to `/blog/[slug]` where slug is the post's URL slug
- Blog posts are automatically generated via workflows when new data is processed
- Blog posts include dynamic Open Graph images and SEO metadata

### Social Media Redirect Routes

The web application includes domain-based social media redirect routes that provide trackable, SEO-friendly URLs:

- **/discord**: Redirects to Discord server with UTM tracking
- **/twitter**: Redirects to Twitter profile with UTM tracking
- **/instagram**: Redirects to Instagram profile with UTM tracking
- **/linkedin**: Redirects to LinkedIn profile with UTM tracking
- **/telegram**: Redirects to Telegram channel with UTM tracking
- **/github**: Redirects to GitHub organisation with UTM tracking

All redirects include standardized UTM parameters:

- `utm_source=sgcarstrends`
- `utm_medium=social_redirect`
- `utm_campaign={platform}_profile`

## UTM Tracking Implementation

The platform implements comprehensive UTM (Urchin Tracking Module) tracking for campaign attribution and analytics,
following industry best practices:

### UTM Architecture

**API UTM Tracking** (`apps/api/src/utils/utm.ts`):

- **Social Media Posts**: Automatically adds UTM parameters to all blog links shared on social platforms
- **Parameters**: `utm_source={platform}`, `utm_medium=social`, `utm_campaign=blog`, optional `utm_content` and
  `utm_term`
- **Platform Integration**: Used by `SocialMediaManager` for LinkedIn, Twitter, Discord, and Telegram posts

**Web UTM Utilities** (`apps/web/src/utils/utm.ts`):

- **External Campaigns**: `createExternalCampaignURL()` for email newsletters and external marketing
- **Parameter Reading**: `useUTMParams()` React hook for future analytics implementation
- **Type Safety**: Full TypeScript support with `UTMParams` interface

### UTM Best Practices

**Follows Industry Standards**:

- `utm_source`: Platform name (e.g., "linkedin", "twitter", "newsletter")
- `utm_medium`: Traffic type (e.g., "social", "email", "referral")
- `utm_campaign`: Campaign identifier (e.g., "blog", "monthly_report")
- `utm_term`: Keywords or targeting criteria (optional)
- `utm_content`: Content variant or placement (optional)

**Internal Link Policy**:

- **No UTM on internal links**: Follows best practices by not tracking internal navigation
- **External campaigns only**: UTM parameters reserved for measuring external traffic sources
- **Social media exceptions**: External social platform posts include UTM for attribution

### Database Commands

- Run migrations: `pnpm db:migrate`
- Check pending migrations: `pnpm db:migrate:check`
- Generate migrations: `pnpm db:generate`
- Push schema: `pnpm db:push`
- Drop database: `pnpm db:drop`

### Documentation Commands

- Docs dev server: `pnpm docs:dev`
- Docs build: `pnpm docs:build`
- Check broken links: `cd apps/docs && pnpm mintlify broken-links`

### Release Commands

- Create release: `pnpm release` (runs semantic-release locally, not recommended for production)
- Manual version check: `npx semantic-release --dry-run` (preview next version without releasing)


### Deployment Commands

**Infrastructure Deployment:**

- Deploy all to dev: `pnpm deploy:dev`
- Deploy all to staging: `pnpm deploy:staging`
- Deploy all to production: `pnpm deploy:prod`

**API Deployment:**

- Deploy API to dev: `pnpm deploy:api:dev`
- Deploy API to staging: `pnpm deploy:api:staging`
- Deploy API to production: `pnpm deploy:api:prod`

**Web Deployment:**

- Deploy web to dev: `pnpm deploy:web:dev`
- Deploy web to staging: `pnpm deploy:web:staging`
- Deploy web to production: `pnpm deploy:web:prod`

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
- **packages/types**: Shared TypeScript type definitions
- **packages/utils**: Shared utility functions and Redis configuration
- **infra**: SST v3 infrastructure configuration for AWS deployment

## Monorepo Build System

The project uses Turbo for efficient monorepo task orchestration:

### Key Build Characteristics

- **Dependency-aware**: Tasks automatically run in dependency order with `dependsOn: ["^build"]` and topological
  ordering
- **Caching**: Build outputs cached with intelligent invalidation based on file inputs
- **Parallel execution**: Independent tasks run concurrently for optimal performance
- **Environment handling**: Loose environment mode with global dependencies on `.env` files, `tsconfig.json`, and
  `NODE_ENV`
- **CI Integration**: Global pass-through environment variables for GitHub and Vercel tokens

### Enhanced Task Configuration

- **Build tasks**: Generate `dist/**`, `.next/**` outputs with environment variable support
- **Test tasks**: Comprehensive input tracking with topological dependencies
- **Development tasks**: `dev` and `test:watch` use `cache: false`, `persistent: true`, and interactive mode
- **Migration tasks**: Track `migrations/**/*.sql` files with environment variables for database operations
- **Deployment tasks**: Cache-disabled with environment variable support for AWS and Vercel
- **TypeScript checking**: Dedicated `typecheck` task with TypeScript configuration dependencies

### Performance Optimisation

- **TUI Interface**: Enhanced terminal user interface for better development experience
- **Loose Environment Mode**: Flexible environment variable handling for development workflows
- **Input Optimisation**: Uses `$TURBO_DEFAULT$` for standard file tracking patterns
- **Coverage Outputs**: Dedicated `coverage/**` directories for test reports
- **E2E Outputs**: `test-results/**` and `playwright-report/**` for end-to-end test artifacts

## Dependency Management

The project uses **pnpm with catalog** for centralised dependency version management. Shared dependencies (React, Next.js, TypeScript, testing tools, etc.) are defined in `pnpm-workspace.yaml` and referenced by workspace packages using the `catalog:` protocol. This ensures version consistency across all workspace packages and simplifies dependency upgrades.

**Key points:**
- Shared dependency versions defined in `pnpm-workspace.yaml`
- Workspace packages reference with `"package": "catalog:"`
- Root-level CLI tools (SST, Turbo, Biome) installed directly in root `package.json`

### Workspace Binaries

When packages are installed at the root level, their CLI binaries (in `node_modules/.bin`) are automatically available
to all workspace packages. This means:

- Root dependencies with CLIs (e.g., `sst`, `turbo`) can be used in any workspace package's scripts
- No need to duplicate CLI tools in individual packages
- Scripts in workspace packages can invoke binaries from root installation

## Code Style

- TypeScript with strict type checking (noImplicitAny, strictNullChecks)
- **Biome**: Used for formatting, linting, and import organisation
    - **Formatting**: 2 spaces for indentation, auto line endings
    - **Import Organisation**: Automatic import sorting via assist actions
    - **Linting**: Recommended rules enabled across the monorepo
    - **VCS Integration**: Git-aware file processing with `.gitignore` support
    - **File Processing**: Uses `ignoreUnknown: true` with explicit includes pattern
    - **Workspace Configs**: Individual apps extend root configuration with app-specific rules
        - Web app: Next.js and React domain rules, Tailwind class sorting, shadcn/ui component exclusion
        - API app: Inherits root configuration only
- Function/variable naming: camelCase
- Class naming: PascalCase
- Constants: UPPER_CASE for true constants
- Error handling: Use try/catch for async operations with specific error types
- Use workspace imports for shared packages: `@sgcarstrends/utils` (includes Redis), `@sgcarstrends/database`, etc.
- Path aliases: Use `@api/` for imports in API app
- Avoid using `any` type - prefer unknown with type guards
- Group imports by: 1) built-in, 2) external, 3) internal
- **Commit messages**: Use conventional commit format with SHORT, concise messages enforced by commitlint:
    - **Preferred style**: Keep messages brief and direct (e.g., `feat: add user auth`, `fix: login error`)
    - `feat: add new feature` (minor version bump)
    - `fix: resolve bug` (patch version bump)
    - `feat!: breaking change` or `feat: add feature\n\nBREAKING CHANGE: description` (major version bump)
    - `chore:`, `docs:`, `style:`, `refactor:`, `test:` (no version bump)
    - **IMPORTANT**: Keep commit messages SHORT - single line with max 50 characters preferred, 72 characters absolute
      maximum
    - Avoid verbose descriptions - focus on what changed, not why or how
    - **Optional scopes**: Use scopes for package-specific changes: `feat(api):`, `fix(web):`, `chore(database):`
    - **Available scopes**: `api`, `web`, `docs`, `database`, `types`, `utils`, `infra`, `deps`, `release`
    - Root-level changes (CI, workspace setup) can omit scopes: `chore: setup commitlint`
- **Spelling**: Use English (Singapore) or English (UK) spellings throughout the entire project

## Git Hooks and Development Workflow

The project uses Husky v9+ with automated git hooks for code quality enforcement:

### Pre-commit Hook

- **lint-staged**: Automatically runs `pnpm biome check --write` on staged `*.{js,ts,tsx,jsx,json}` files
- Formats code, organises imports, and fixes lint issues before commits
- Only processes staged files for performance
- Configured in root `package.json` lint-staged section

### Commit Message Hook

- **commitlint**: Validates commit messages against conventional commit format
- Enforces optional scope validation for monorepo consistency
- Rejects commits with invalid format and provides helpful error messages

### Development Workflow

- Git hooks run automatically on `git commit`
- Failed hooks prevent commits and display clear error messages
- Use `git commit -n` to bypass hooks if needed (not recommended)
- Hooks ensure consistent code style and commit message format across the team

## Testing

- Testing framework: Vitest
- Tests should be in `__tests__` directories next to implementation
- Test file suffix: `.test.ts`
- Aim for high test coverage, especially for utility functions
- Use mock data where appropriate, avoid hitting real APIs in tests
- Coverage reports generated with V8 coverage
- Test both happy and error paths
- For component tests, focus on functionality rather than implementation details

## API Endpoints

### Data Access Endpoints

- **/v1/cars**: Car registration data (filterable by month, make, fuel type)
- **/v1/coe**: COE bidding results
- **/v1/coe/pqp**: COE Prevailing Quota Premium rates
- **/v1/makes**: List of car manufacturers
- **/v1/months/latest**: Get the latest month with data

### Updater Endpoints

- **/workflows/trigger**: Trigger data update workflows (authenticated)
- **/workflow/cars**: Car data update workflow endpoint
- **/workflow/coe**: COE data update workflow endpoint
- **/linkedin**: LinkedIn posting webhook
- **/twitter**: Twitter posting webhook
- **/discord**: Discord posting webhook
- **/telegram**: Telegram posting webhook

## Environment Setup

Required environment variables (store in .env.local for local development):

- DATABASE_URL: PostgreSQL connection string
- SG_CARS_TRENDS_API_TOKEN: Authentication token for API access
- UPSTASH_REDIS_REST_URL: Redis URL for caching
- UPSTASH_REDIS_REST_TOKEN: Redis authentication token
- UPDATER_API_TOKEN: Updater service token for scheduler
- LTA_DATAMALL_API_KEY: API key for LTA DataMall (for updater service)
- GOOGLE_GENERATIVE_AI_API_KEY: Google Gemini API key for blog post generation (used by Vercel AI SDK)

Optional environment variables for LLM observability:

- LANGFUSE_PUBLIC_KEY: Langfuse public key for LLM observability and analytics
- LANGFUSE_SECRET_KEY: Langfuse secret key for LLM observability and analytics
- LANGFUSE_HOST: Langfuse host URL (defaults to https://cloud.langfuse.com, use https://us.cloud.langfuse.com for US
  region)

## Deployment

- AWS Region: ap-southeast-1 (Singapore)
- Architecture: arm64
- Domains: sgcarstrends.com (with environment subdomains)
- Cloudflare for DNS management
- SST framework for infrastructure

## Vercel Related Projects

The monorepo uses Vercel Related Projects to enable automatic, environment-aware URL resolution between the API and web
applications.

### Configuration

**Project IDs:**

- API Project: `prj_fyAvupEssH3LO4OQFDWplinVFlaI`
- Web Project: `prj_RE6GjplQ6imcQuHQ93BmqSBJp6Cg`
- Team ID: `team_qV2SHJrecCAdJ3pvkjZSkJhL`

**Configuration Files:**

- `apps/web/vercel.json`: References API project for automatic URL resolution
- `apps/api/vercel.json`: References web project for bidirectional communication

### How It Works

1. **Automatic Resolution**: The web app uses `@vercel/related-projects` to automatically resolve the API URL based on
   the deployment environment
2. **Environment Detection**: Works seamlessly across dev, staging, production, and preview deployments
3. **Fallback Strategy**: If Vercel Related Projects data is unavailable, falls back to `NEXT_PUBLIC_API_URL` or
   `https://api.sgcarstrends.com`
4. **No Manual Configuration**: Eliminates the need for environment-specific API URL variables in Vercel deployments

### Usage in Code

```typescript
import {withRelatedProject} from '@vercel/related-projects';

const API_BASE_URL = withRelatedProject({
    projectName: 'api',
    defaultHost: 'https://api.sgcarstrends.com',
});
```

### Benefits

- ✅ Automatic URL resolution across all environments
- ✅ Seamless preview deployment support
- ✅ Type-safe with TypeScript
- ✅ Backward compatible with SST deployments
- ✅ Reduced configuration complexity

## Domain Convention

SG Cars Trends uses a standardized domain convention across services:

### API Service

- **Convention**: `<service>.<environment>.<domain>`
- **Production**: `api.sgcarstrends.com`
- **Staging**: `api.staging.sgcarstrends.com`
- **Development**: `api.dev.sgcarstrends.com`

### Web Application

- **Convention**: `<environment>.<domain>` with apex domain for production
- **Production**: `sgcarstrends.com` (main user-facing domain)
- **Staging**: `staging.sgcarstrends.com`
- **Development**: `dev.sgcarstrends.com`

### Domain Strategy

- **API services** follow strict `<service>.<environment>.<domain>` pattern for clear service identification
- **Web frontend** uses user-friendly approach with apex domain in production for optimal SEO and branding
- **DNS Management**: All domains managed through Cloudflare with automatic SSL certificate provisioning
- **Cross-Origin Requests**: CORS configured to allow appropriate domain combinations across environments

### Adding New Services

- Backend services: Follow API pattern `<service>.<environment>.sgcarstrends.com`
- Frontend services: Evaluate based on user interaction needs (apex domain vs service subdomain)

## Data Models

The platform uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **cars**: Car registrations by make, fuel type, and vehicle type with strategic indexing
- **coe**: COE bidding results (quota, bids, premium by category)
- **coePQP**: Prevailing Quota Premium rates
- **posts**: LLM-generated blog posts with metadata, tags, SEO information, and analytics
- **analyticsTable**: Page views and visitor tracking for performance monitoring

### Database Configuration

The database uses **snake_case** column naming convention configured in both Drizzle config and client setup. This
ensures consistent naming patterns between the database schema and TypeScript types.

*See [packages/database/CLAUDE.md](packages/database/CLAUDE.md) for detailed schema definitions, migration workflows,
and TypeScript integration patterns.*

## Workflow Architecture

The integrated updater service uses a workflow-based architecture with:

### Key Components

- **Workflows** (`src/lib/workflows/`): Cars and COE data processing workflows with integrated blog generation
- **Task Processing** (`src/lib/workflows/workflow.ts`): Common processing logic with Redis-based timestamp tracking
- **Updater Core** (`src/lib/updater/`): File download, checksum verification, CSV processing, and database
  updates (with helpers under `src/lib/updater/services/`)
- **Blog Generation** (`src/lib/workflows/posts.ts`): LLM-powered blog post creation using Vercel AI SDK with Google
  Gemini
- **Post Management** (`src/lib/workflows/save-post.ts`): Blog post persistence with slug generation and duplicate
  prevention
- **Social Media** (`src/lib/social/*/`): Platform-specific posting functionality (Discord, LinkedIn, Telegram, Twitter)
- **QStash Integration** (`src/config/qstash.ts`): Message queue functionality for workflow execution

### Workflow Flow

1. Workflows triggered via HTTP endpoints or scheduled QStash cron jobs
2. Files downloaded and checksums verified to prevent redundant processing
3. New data inserted into database in batches
4. Updates published to configured social media platforms when data changes
5. **Blog Generation**: LLM analyses processed data to create comprehensive blog posts with market insights
6. **Blog Publication**: Generated posts saved to database with SEO-optimised slugs and metadata
7. **Blog Promotion**: New blog posts automatically announced across social media platforms
8. Comprehensive error handling with Discord notifications for failures

### Design Principles

- Modular and independent workflows
- Checksum-based redundancy prevention
- Batch database operations for efficiency
- Conditional social media publishing based on environment and data changes

## LLM Blog Generation

The platform features automated blog post generation using Vercel AI SDK with Google Gemini to create market insights
from processed data:

### Blog Generation Process

1. **Data Analysis**: LLM analyses car registration or COE bidding data for the latest month
2. **Content Creation**: AI generates comprehensive blog posts with market insights, trends, and analysis
3. **Structured Output**: Posts include executive summaries, data tables, and professional market analysis
4. **SEO Optimisation**: Automatic generation of titles, descriptions, and structured data
5. **Duplicate Prevention**: Slug-based system prevents duplicate blog posts for the same data period

### Blog Content Features

- **Cars Posts**: Analysis of registration trends, fuel type distribution, vehicle type breakdowns
- **COE Posts**: Bidding results analysis, premium trends, market competition insights
- **Data Tables**: Markdown tables for fuel type and vehicle type breakdowns
- **Market Insights**: Professional analysis of trends and implications for car buyers
- **Reading Time**: Automatic calculation of estimated reading time
- **AI Attribution**: Clear labeling of AI-generated content with model version tracking

### Blog Publication

- **Automatic Scheduling**: Blog posts generated only when both COE bidding exercises are complete (for COE posts)
- **Social Media Promotion**: New blog posts automatically announced across all configured platforms
- **SEO Integration**: Dynamic Open Graph images, structured data, and canonical URLs
- **Content Management**: Posts stored with metadata including generation details and data source month

### LLM Observability with Langfuse

The platform integrates **Langfuse** for comprehensive LLM observability and analytics on blog generation:

- **Token Usage Tracking**: Monitor prompt tokens, completion tokens, and total usage per generation
- **Cost Analysis**: Track API costs with model-specific pricing (Google Gemini 2.5 Flash)
- **Performance Monitoring**: Measure latency, response times, and identify bottlenecks
- **Prompt Optimisation**: Analyze system instructions and prompt effectiveness for quality improvements
- **Error Debugging**: Detailed traces for troubleshooting generation failures with full context
- **Environment Tracking**: Automatic tagging with stage (dev/staging/prod) for environment-specific analysis

Langfuse integration uses **OpenTelemetry** with Vercel AI SDK's experimental telemetry feature. The instrumentation is
optional and automatically disabled if credentials are not provided. See [apps/api/CLAUDE.md](apps/api/CLAUDE.md) for
detailed configuration instructions.

## Shared Package Architecture

The project uses shared packages for cross-application concerns:

### Redis Configuration (`packages/utils`)

Redis configuration is centralised in the `@sgcarstrends/utils` package to eliminate duplication:

- **Shared Redis Instance**: Exported `redis` client configured with Upstash credentials
- **Environment Variables**: Automatically reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- **Usage Pattern**: Import via `import { redis } from "@sgcarstrends/utils"`
- **Applications**: Used by both API service (caching, workflows) and web application (analytics, view tracking)

This consolidation ensures consistent Redis configuration across all applications and simplifies environment management.

### Other Shared Utilities

- **Type Definitions**: `@sgcarstrends/types` for shared TypeScript interfaces
- **Database Schema**: `@sgcarstrends/database` for Drizzle ORM schemas and migrations
- **Utility Functions**: Date formatting, percentage calculations, and key generation utilities

## Release Process

Releases are automated using semantic-release based on conventional commits:

- **Automatic releases**: Triggered on push to main branch via GitHub Actions
- **Version format**: Uses "v" prefix (v1.0.0, v1.1.0, v2.0.0)
- **Unified versioning**: All workspace packages receive the same version bump
- **Changelog**: Automatically generated and updated
- **GitHub releases**: Created automatically with release notes

## GitHub Actions Workflows

The repository contains several GitHub Actions workflows for CI/CD automation:

### Active Workflows

- **release.yml**: Automated releases on main branch (lint, test, semantic-release)
- **deploy-staging.yml**: Deploy to staging environment on main branch push
- **deploy-prod.yml**: Deploy to production environment on release branch push
- **run-migrations.yml**: Reusable workflow for database migrations
- **test.yml**: Reusable workflow for running tests with coverage

### Disabled Workflows

The following workflows are currently **disabled** (triggers commented out, only `workflow_dispatch` enabled):

- **deploy-pr.yml**: PR preview deployments (disabled)
- **cleanup-pr.yml**: PR preview cleanup (disabled)

**Important**: When making changes to GitHub Actions workflows, skip the disabled workflows (`deploy-pr.yml` and `cleanup-pr.yml`) unless specifically re-enabling them. These workflows are intentionally disabled and do not require updates.

## Contribution Guidelines

- Create feature branches from main branch
- **Use conventional commit messages** following the format specified in Code Style section
- Submit PRs with descriptive titles and summaries
- Ensure CI passes (tests, lint, typecheck) before requesting review
- Maintain backward compatibility for public APIs
- Follow project spelling and commit message conventions as outlined in Code Style section
- **Use GitHub issue templates** when available - always follow established templates when creating or managing GitHub
  issues

## Documentation Maintenance

This section defines when changes require updates to project documentation.

### Documentation File Structure

The monorepo contains multiple documentation files:

- **Root CLAUDE.md**: Cross-cutting concerns, monorepo structure, shared commands
- **Component CLAUDE.md files**: `apps/api/CLAUDE.md`, `apps/web/CLAUDE.md`, `packages/database/CLAUDE.md`,
  `infra/CLAUDE.md`
- **README.md files**: Package-specific setup and usage instructions
- **Architecture docs**: `apps/docs/architecture/*.md` for system design and diagrams

### When to Update Root CLAUDE.md

Update this file when making changes that affect the entire monorepo or cross-cutting concerns:

**Monorepo Structure:**

- New apps or packages added to workspace
- Changes to pnpm catalog or dependency management
- Updates to Turbo build configuration or task orchestration
- New shared packages or workspace utilities

**Cross-Cutting Commands:**

- New pnpm scripts in root package.json
- Changes to build, test, or deployment commands
- Updates to database migration commands
- New documentation or release commands

**Shared Configuration:**

- Changes to git hooks (Husky, lint-staged, commitlint)
- Updates to Biome configuration or code style rules
- New environment variables affecting multiple packages
- Changes to release process or semantic-release configuration

**Deployment & Infrastructure:**

- Updates to domain convention or DNS strategy
- Changes to AWS region, architecture, or deployment patterns
- New deployment environments or commands

### When to Update Component CLAUDE.md Files

Update component-specific CLAUDE.md files (`apps/*/CLAUDE.md`, `packages/*/CLAUDE.md`) for changes affecting that
component:

**API Service (`apps/api/CLAUDE.md`):**

- New or modified API endpoints
- Changes to workflow architecture or QStash integration
- Updates to social media integration or posting logic
- New LLM features or Vercel AI SDK configuration
- Changes to tRPC router or authentication
- Updates to Redis caching or data processing

**Web Application (`apps/web/CLAUDE.md`):**

- New pages or routes
- Changes to blog functionality or analytics
- Updates to HeroUI components or styling patterns
- New server actions or client components
- Changes to UTM tracking or social media redirects

**Database (`packages/database/CLAUDE.md`):**

- New tables or schema changes
- Updates to migration workflow
- Changes to Drizzle ORM configuration or naming conventions
- New database utilities or helper functions

**Infrastructure (`infra/CLAUDE.md`):**

- Changes to SST configuration or AWS resources
- Updates to domain management or SSL setup
- New infrastructure components or services

### When to Update README.md Files

Update README.md files when making changes that affect setup, usage, or user-facing features:

**User-Facing Features:**

- New blog features or analytics capabilities
- Changes to API endpoints or data access patterns
- Updates to social media integration or redirect routes
- New visualization or charting features

**Setup & Installation:**

- Changes to installation steps or prerequisites
- New environment variables required for setup
- Updates to API key requirements (LTA DataMall, Gemini, etc.)
- Changes to database setup or migration process

**Tech Stack:**

- Major dependency changes or framework updates
- New external services (Upstash, QStash, etc.)
- Updates to AI models or providers
- Changes to build tools or runtime requirements

### When to Update Architecture Documentation

Update architecture docs (`apps/docs/architecture/*.md`) for significant structural changes:

**System Architecture:**

- New services or major component additions
- Changes to data flow or processing pipelines
- Updates to integration patterns between components

**Diagrams:**

- Update corresponding Mermaid diagrams in `apps/docs/diagrams/` when architecture changes
- Regenerate diagrams when entity relationships or workflows change

### Quick Reference Checklist

Before committing changes, ask:

- [ ] Did I add a new package or app? → Update **root CLAUDE.md** Monorepo Structure
- [ ] Did I add/modify API endpoints? → Update **apps/api/CLAUDE.md** and potentially **root CLAUDE.md** API Endpoints
- [ ] Did I change database schema? → Update **packages/database/CLAUDE.md** and run migrations
- [ ] Did I add environment variables? → Update **relevant CLAUDE.md** and **README.md** files
- [ ] Did I modify workflows or social media integration? → Update **apps/api/CLAUDE.md**
- [ ] Did I add user-facing features? → Update **apps/web/CLAUDE.md** and **README.md**
- [ ] Did I change infrastructure? → Update **infra/CLAUDE.md**
- [ ] Did I modify system architecture? → Update **apps/docs/architecture/** and diagrams
- [ ] Did I add monorepo commands or change build process? → Update **root CLAUDE.md**

**Rule of thumb**: If it changes behaviour, configuration, structure, or developer workflow, update documentation. When
in doubt, update it. Component-specific changes update component docs; cross-cutting changes update root docs.
