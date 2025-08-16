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

- **[apps/api/CLAUDE.md](apps/api/CLAUDE.md)**: API service development with Hono, workflows, tRPC, and social media integration
- **[apps/web/CLAUDE.md](apps/web/CLAUDE.md)**: Web application development with Next.js 15, HeroUI, blog features, and analytics
- **[packages/database/CLAUDE.md](packages/database/CLAUDE.md)**: Database schema management with Drizzle ORM, migrations, and TypeScript integration
- **[infra/CLAUDE.md](infra/CLAUDE.md)**: Infrastructure configuration with SST v3, AWS deployment, and domain management

Refer to these files for component-specific development guidance and best practices.

# SG Cars Trends Platform - Overview

## Project Overview

SG Cars Trends is a full-stack platform providing access to Singapore vehicle registration data and Certificate of
Entitlement (COE) bidding results. The monorepo includes:

- **API Service**: RESTful endpoints for accessing car registration and COE data (Hono framework)
- **Web Application**: Next.js frontend with interactive charts, analytics, and blog functionality
- **Integrated Updater**: Workflow-based data update system with scheduled jobs that fetch and process data from LTA
  DataMall (QStash workflows)
- **LLM Blog Generation**: Automated blog post creation using Google Gemini AI to analyse market data and generate
  insights
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter when new data is available
- **Documentation**: Comprehensive developer documentation using Mintlify

## Commands

### Common Commands

- Build all: `pnpm build`
- Develop: `pnpm dev`
- Lint: `pnpm lint` (uses Biome)
- Test all: `pnpm test`
- Test watch: `pnpm test:watch`
- Test coverage: `pnpm test:coverage`
- E2E tests: `pnpm test:e2e`
- E2E tests with UI: `pnpm test:e2e:ui`
- Run single test: `pnpm -F @sgcarstrends/api test -- src/utils/__tests__/slugify.test.ts`
- Package-specific test: `pnpm -F @sgcarstrends/<package> test`

### Web Application Commands

- Web dev server: `pnpm web:dev`
- Web build: `pnpm web:build`
- Web start: `pnpm web:start`

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

### Documentation Commands

- Docs dev server: `pnpm docs:dev`
- Docs build: `pnpm docs:build`

### Database Commands

- Run migrations: `pnpm migrate`
- Check pending migrations: `pnpm migrate:check`

### Release Commands

- Create release: `pnpm release` (runs semantic-release locally, not recommended for production)
- Manual version check: `npx semantic-release --dry-run` (preview next version without releasing)

### Deployment Commands

- Deploy API (includes updater functionality): `pnpm -F @sgcarstrends/api deploy`
- Deploy to specific stage: `pnpm -F @sgcarstrends/api deploy --stage <stage-name>`
- Deploy web to dev: `pnpm web:deploy:dev`
- Deploy web to staging: `pnpm web:deploy:staging`
- Deploy web to production: `pnpm web:deploy:prod`

## Code Structure

- **apps/api**: Unified API service using Hono framework with integrated updater workflows
    - **src/v1**: API endpoints for data access
    - **src/lib/workflows**: Workflow-based data update system and social media integration
    - **src/lib/gemini**: LLM blog generation using Google Gemini AI
    - **src/routes**: API route handlers including workflow endpoints
    - **src/config**: Database, Redis, QStash, and platform configurations
    - **src/trpc**: Type-safe tRPC router with authentication
- **apps/web**: Next.js frontend application
    - **src/app**: Next.js App Router pages and layouts with blog functionality
    - **src/components**: React components with comprehensive tests
    - **src/actions**: Server actions for blog and analytics functionality
    - **src/utils**: Web-specific utility functions
- **apps/docs**: Mintlify documentation site
- **packages/database**: Database schema and migrations using Drizzle ORM
    - **src/db**: Schema definitions for cars, COE, posts, and analytics tables
    - **migrations**: Database migration files with version tracking
- **packages/types**: Shared TypeScript type definitions
- **packages/utils**: Shared utility functions
- **infra**: SST v3 infrastructure configuration for AWS deployment

## Code Style

- TypeScript with strict type checking (noImplicitAny, strictNullChecks)
- Use double quotes for strings (Biome enforced)
- Use spaces for indentation (2 spaces, Biome enforced)
- Organise imports automatically (Biome enforced)
- Function/variable naming: camelCase
- Class naming: PascalCase
- Constants: UPPER_CASE for true constants
- Error handling: Use try/catch for async operations with specific error types
- Use workspace imports for shared packages: `@sgcarstrends/utils`, etc.
- Path aliases: Use `@api/` for imports in API app
- Avoid using `any` type - prefer unknown with type guards
- Group imports by: 1) built-in, 2) external, 3) internal
- **Commit messages**: Use conventional commit format for semantic-release:
    - `feat: add new feature` (minor version bump)
    - `fix: resolve bug` (patch version bump)
    - `feat!: breaking change` or `feat: add feature\n\nBREAKING CHANGE: description` (major version bump)
    - `chore:`, `docs:`, `style:`, `refactor:`, `test:` (no version bump)
    - Keep commit messages short and to 1 line (max 72 characters for subject line)
- **Spelling**: Use English (Singapore) or English (UK) spellings throughout the entire project

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
- GEMINI_API_KEY: Google Gemini AI API key for blog post generation

## Deployment

- AWS Region: ap-southeast-1 (Singapore)
- Architecture: arm64
- Domains: sgcarstrends.com (with environment subdomains)
- Cloudflare for DNS management
- SST framework for infrastructure

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

*See [packages/database/CLAUDE.md](packages/database/CLAUDE.md) for detailed schema definitions, migration workflows, and TypeScript integration patterns.*

## Workflow Architecture

The integrated updater service uses a workflow-based architecture with:

### Key Components

- **Workflows** (`src/lib/workflows/`): Cars and COE data processing workflows with integrated blog generation
- **Task Processing** (`src/lib/workflows/workflow.ts`): Common processing logic with Redis-based timestamp tracking
- **Updater Core** (`src/lib/workflows/updater.ts`): File download, checksum verification, CSV processing, and database
  updates
- **Blog Generation** (`src/lib/workflows/posts.ts`): LLM-powered blog post creation using Google Gemini AI
- **Post Management** (`src/lib/workflows/save-post.ts`): Blog post persistence with slug generation and duplicate
  prevention
- **Social Media** (`src/lib/social/*/`): Platform-specific posting functionality (Discord, LinkedIn, Telegram, Twitter)
- **QStash Integration** (`src/config/qstash.ts`): Message queue functionality for workflow execution

### Workflow Flow

1. Workflows triggered via HTTP endpoints or scheduled QStash cron jobs
2. Files downloaded and checksums verified to prevent redundant processing
3. New data inserted into database in batches
4. Updates published to configured social media platforms when data changes
5. **Blog Generation**: LLM analyzes processed data to create comprehensive blog posts with market insights
6. **Blog Publication**: Generated posts saved to database with SEO-optimized slugs and metadata
7. **Blog Promotion**: New blog posts automatically announced across social media platforms
8. Comprehensive error handling with Discord notifications for failures

### Design Principles

- Modular and independent workflows
- Checksum-based redundancy prevention
- Batch database operations for efficiency
- Conditional social media publishing based on environment and data changes

## LLM Blog Generation

The platform features automated blog post generation using Google Gemini AI to create market insights from processed
data:

### Blog Generation Process

1. **Data Analysis**: LLM analyzes car registration or COE bidding data for the latest month
2. **Content Creation**: AI generates comprehensive blog posts with market insights, trends, and analysis
3. **Structured Output**: Posts include executive summaries, data tables, and professional market analysis
4. **SEO Optimization**: Automatic generation of titles, descriptions, and structured data
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

## Release Process

Releases are automated using semantic-release based on conventional commits:

- **Automatic releases**: Triggered on push to main branch via GitHub Actions
- **Version format**: Uses "v" prefix (v1.0.0, v1.1.0, v2.0.0)
- **Unified versioning**: All workspace packages receive the same version bump
- **Changelog**: Automatically generated and updated
- **GitHub releases**: Created automatically with release notes

## Contribution Guidelines

- Create feature branches from main branch
- **Use conventional commit messages** following the format specified in Code Style section
- Submit PRs with descriptive titles and summaries
- Ensure CI passes (tests, lint, typecheck) before requesting review
- Maintain backward compatibility for public APIs
- Follow project spelling and commit message conventions as outlined in Code Style section