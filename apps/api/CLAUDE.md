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
- **Blog Generation**: LLM-powered blog post creation using Vercel AI SDK with Google Gemini
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
- **src/lib/gemini/**: LLM-powered blog post generation using Vercel AI SDK with Google Gemini
- **src/lib/social/**: Platform-specific social media posting logic
- **src/config/**: Configuration for databases, Redis, QStash, and platforms
- **src/utils/**: Utility functions for file processing, caching, and responses

### Workflow Architecture

The API uses a workflow-based system for data processing:

- **Workflow Runtime** (`src/lib/workflows/workflow.ts`): Common workflow helpers, step runner, Redis timestamps
- **Data Updaters** (`src/lib/workflows/update-cars.ts`, `src/lib/workflows/update-coe.ts`): Automated data fetching and processing
- **Blog Generation** (`src/lib/workflows/posts.ts`): LLM-powered blog post creation using Vercel AI SDK with Google Gemini via `src/lib/gemini/generate-post.ts`
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
- **Test Location**: Co-located with code in `__tests__/` directories
- **Test Pattern**: `feature/__tests__/component.test.ts` or `feature/__tests__/component.spec.ts`
- **Test Discovery**: `src/**/*.{test,spec}.{js,ts}`
- **Path Resolution**: Uses @api alias matching TypeScript configuration
- **Coverage Targets**: All `src/**/*.{js,ts}` files except node_modules and type definitions
- **Co-location Benefits**: Tests live next to implementation for better discoverability and maintainability

## Environment Variables

Required for local development (.env.local):

- `SG_CARS_TRENDS_API_TOKEN`: API authentication token
- `DATABASE_URL`: PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL`: Redis caching URL
- `UPSTASH_REDIS_REST_TOKEN`: Redis authentication
- `UPSTASH_QSTASH_TOKEN`: QStash workflow token
- `GOOGLE_GENERATIVE_AI_API_KEY`: Google Gemini API key for blog generation (used by Vercel AI SDK)
- `LANGFUSE_PUBLIC_KEY`: Langfuse public key for LLM observability (optional)
- `LANGFUSE_SECRET_KEY`: Langfuse secret key for LLM observability (optional)
- `LANGFUSE_HOST`: Langfuse host URL, defaults to https://cloud.langfuse.com (optional)
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

## LLM Observability with Langfuse

The API integrates Langfuse for comprehensive LLM observability and analytics:

### Features

- **Token Usage Tracking**: Monitor prompt tokens, completion tokens, and total tokens for each blog generation
- **Cost Analysis**: Track API costs per generation with model-specific pricing (Gemini 2.5 Flash)
- **Performance Monitoring**: Measure latency, response times, and identify bottlenecks
- **Prompt Effectiveness**: Analyze system instructions and prompt performance
- **Error Debugging**: Detailed traces for troubleshooting generation failures
- **Environment Tracking**: Automatically tag traces with stage (dev/staging/prod)

### Implementation

- **Instrumentation**: `src/instrumentation.ts` - OpenTelemetry setup with Langfuse span processor
- **Telemetry**: Enabled in `src/lib/gemini/generate-post.ts` via Vercel AI SDK's experimental telemetry
- **Automatic Initialization**: Instrumentation starts on Lambda cold start before any imports
- **Optional**: Langfuse credentials are optional - API works without them

### Configuration

Set the following environment variables to enable Langfuse:

```bash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com  # Or https://us.cloud.langfuse.com for US region
```

### Trace Metadata

Each blog post generation trace includes:

- `functionId`: `post-generation/cars` or `post-generation/coe`
- `month`: Data month being processed
- `dataType`: Either "cars" or "coe"
- `stage`: Environment (from `VERCEL_ENV` or `STAGE`)
- Model usage: Prompt tokens, completion tokens, total tokens
- Response metadata: Response ID, model ID, timestamp

### Quality Scoring

Automated quality scores are calculated and attached to each generation trace:

#### Content Quality Score (0-1)
Evaluates post structure and completeness:
- **Word count** (400-600 words target): 0.3 points
- **Title presence** (# header): 0.2 points
- **Section headers** (## headers, 2+ required): 0.2 points
- **Data tables** (markdown tables, 3+ rows): 0.2 points
- **Bullet points** (list formatting): 0.1 points

#### Token Efficiency Score (0-1)
Measures output quality vs. tokens consumed:
- **Optimal** (1.5-2.5 tokens/word): 1.0
- **Too efficient** (<1.5 tokens/word): 0.8 (may indicate low quality)
- **Acceptable** (2.5-3.5 tokens/word): 0.7
- **Inefficient** (>3.5 tokens/word): 0.5

#### Generation Success Score (0-1)
Indicates completion status:
- **Complete** (no errors, proper ending): 1.0
- **Partial** (incomplete or truncated): 0.5
- **Failed** (error occurred): 0.0

#### Overall Score
Average of all three scores, providing a single quality metric per generation.

**Viewing Scores**: All scores are visible in Langfuse dashboard as span attributes (`score.content_quality`, `score.token_efficiency`, `score.generation_success`, `score.overall`).
