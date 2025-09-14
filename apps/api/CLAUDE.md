# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Access

When working with external libraries or frameworks, use the Context7 MCP tools to get up-to-date documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID for any package
2. Use `mcp__context7__get-library-docs` to retrieve comprehensive documentation and examples

This ensures you have access to the latest API documentation for dependencies like Hono, Drizzle ORM, Vitest, QStash,
and others used in this project.

# SG Cars Trends API - Developer Reference Guide

## Project Overview

The SG Cars Trends API is a Hono-based REST API service that provides Singapore vehicle registration data and COE
bidding results. Key features include:

- **REST API**: OpenAPI-documented endpoints using Hono framework
- **Workflow System**: QStash-powered data processing workflows for automated updates
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Twitter, and Telegram
- **Blog Generation**: LLM-powered blog post creation using Google Gemini AI
- **tRPC Support**: Type-safe API endpoints with authentication
- **Multi-stage Deployment**: SST-powered deployment to dev, staging, and production

## Commands

### Development Commands

- **Start development server**: `pnpm dev` (runs SST dev with dev stage)
- **Run tests**: `pnpm test` (Vitest run)
- **Watch tests**: `pnpm test:watch` (Vitest watch mode)
- **Test coverage**: `pnpm test:coverage` (generates V8 coverage reports)
- **Lint code**: `pnpm lint` (Biome check)

### Deployment Commands

- **Deploy to dev**: `pnpm deploy:dev`
- **Deploy to staging**: `pnpm deploy:staging`
- **Deploy to production**: `pnpm deploy:prod`

### Testing Specific Files

- **Single test file**: `vitest run src/path/to/file.test.ts`
- **Test directory**: `vitest run src/utils/__tests__/`

## Code Architecture

### Core Structure

- **src/index.ts**: Main Hono app with middleware, routes, and error handling
- **src/v1/**: Versioned API routes (cars, coe, months) with bearer authentication
- **src/routes/**: Workflow endpoints and social media webhooks
- **src/trpc/**: Type-safe tRPC router with context creation
- **src/lib/workflows/**: QStash workflows (cars, coe, posts, save-post, update-cars, update-coe, workflow, options)
- **src/lib/gemini/**: LLM-powered blog post generation using Google Gemini AI
- **src/lib/social/**: Platform-specific social media posting logic
- **src/config/**: Configuration for databases, Redis, QStash, and platforms
- **src/utils/**: Utility functions for file processing, caching, and responses

### Workflow Architecture

The API uses a workflow-based system for data processing:

- **Workflow Runtime** (`src/lib/workflows/workflow.ts`): Common workflow helpers, step runner, Redis timestamps
- **Data Updaters** (`src/lib/workflows/update-cars.ts`, `src/lib/workflows/update-coe.ts`): Automated data fetching and processing
- **Blog Generation** (`src/lib/workflows/posts.ts`): LLM-powered blog post creation using Google Gemini via `src/lib/gemini/generate-post.ts`
- **Post Management** (`src/lib/workflows/save-post.ts`): Blog post persistence with idempotency support
- **Main Workflows** (`src/lib/workflows/cars.ts`, `src/lib/workflows/coe.ts`): Main workflow orchestrators exposed as routes
- **Social Publishing**: Automated posting to platforms when data updates occur

### Authentication & Security

- **Bearer Token Auth**: All /v1 routes and /trpc endpoints require `SG_CARS_TRENDS_API_TOKEN`
- **Workflow Authentication**: Workflow triggers protected by bearer authentication
- **Rate Limiting**: Commented rate limiting implementation using Upstash Redis

## API Endpoints

### Public Endpoints

- **GET /**: Scalar API documentation interface
- **GET /docs**: OpenAPI specification
- **GET /health**: Health check endpoint

### Authenticated Endpoints (Bearer token required)

- **GET /v1/cars**: Car registration data with filtering
- **GET /v1/coe**: COE bidding results
- **GET /v1/months**: Available data months
- **POST /workflows/trigger**: Trigger data update workflows
- **All /trpc/** endpoints\*\*: Type-safe tRPC procedures

### Workflow Endpoints

- **POST /workflows/cars**: Car data processing workflow
- **POST /workflows/coe**: COE data processing workflow
- **POST /workflows/linkedin**: LinkedIn posting webhook
- **POST /workflows/twitter**: Twitter posting webhook
- **POST /workflows/discord**: Discord posting webhook
- **POST /workflows/telegram**: Telegram posting webhook

## Path Aliases

- **@api/\***: Maps to `src/*` for internal imports
- Use workspace imports: `@sgcarstrends/database`, `@sgcarstrends/types`, `@sgcarstrends/utils`

## Testing Strategy

- **Framework**: Vitest with globals enabled
- **Coverage**: V8 provider with text, JSON, and HTML reports
- **Test Location**: `src/**/*.{test,spec}.{js,ts}`
- **Path Resolution**: Uses @api alias matching TypeScript configuration
- **Coverage Targets**: All `src/**/*.{js,ts}` files except node_modules and type definitions

## Environment Variables

Required for local development (.env.local):

- `SG_CARS_TRENDS_API_TOKEN`: API authentication token
- `DATABASE_URL`: PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL`: Redis caching URL
- `UPSTASH_REDIS_REST_TOKEN`: Redis authentication
- `UPSTASH_QSTASH_TOKEN`: QStash workflow token
- `GEMINI_API_KEY`: Google Gemini AI for blog generation
- Social media platform tokens for integrations (Discord, LinkedIn, Twitter, Telegram)

## Code Style

- **TypeScript**: Strict mode with @api path aliases
- **Linting**: Biome with automatic formatting
- **Import Organization**: Built-in modules, external packages, workspace packages, internal imports
- **Error Handling**: HTTPException for known errors, structured JSON responses
- **Async Patterns**: Promise-based with try/catch blocks in workflows

## Workflow Development

When working with workflows:

- Use `WorkflowContext.run()` for atomic operations
- Implement proper error handling with platform notifications
- Use Redis for timestamp tracking to prevent redundant processing
- Structure workflows as composable task handlers
- Test workflow logic independently of QStash integration

## Social Media Integration

Each platform has dedicated posting logic in `src/lib/social/*/`:

- **Platform-specific APIs**: LinkedIn API client, Twitter API v2, Discord webhooks, Telegram bot API
- **Conditional Publishing**: Environment-based platform enabling
- **Error Notifications**: Discord notifications for posting failures
- **Content Formatting**: Platform-appropriate message formatting and link handling
