# SG Cars Trends API - Developer Reference Guide

## Project Overview

The SG Cars Trends API is a Hono-based REST API service that provides Singapore vehicle registration data, COE
bidding results, and vehicle deregistration statistics. Key features include:

- **REST API**: OpenAPI-documented endpoints using Hono framework
- **Workflow System**: QStash-powered data processing workflows for automated updates
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Twitter, and Telegram
- **Blog Generation**: LLM-powered blog post creation using Vercel AI SDK with Google Gemini
- **Multi-stage Deployment**: SST-powered deployment to dev, staging, and production

## Commands

### Development Commands

- **Start development server**: `bun run dev` (runs SST dev with dev stage)
- **Run tests**: `bun run test` (Vitest run)
- **Watch tests**: `bun run test:watch` (Vitest watch mode)
- **Test coverage**: `bun run test:coverage` (generates V8 coverage reports)
- **Lint code**: `bun run lint` (Biome check)

### Deployment Commands

See `sst-deployment` skill for multi-environment deployment workflows.

### Testing Specific Files

- **Single test file**: `vitest run src/path/to/file.test.ts`
- **Test directory**: `vitest run src/utils/__tests__/`

## Code Architecture

### Core Structure

- **src/index.ts**: Main Hono app with middleware, routes, and error handling
- **src/features/**: Feature modules (cars, coe, health, logos, months, workflows, newsletter, shared)
- **src/v1/**: Versioned API routes (cars, coe, months) with bearer authentication
- **src/routes/**: Workflow endpoints and social media webhooks
- **src/lib/workflows/**: QStash workflows (cars, coe, deregistration, posts, save-post, update-cars, update-coe, update-deregistration, options)
- **src/lib/workflows/steps/**: Reusable workflow step functions (process-task, publish-to-all-platforms, revalidate-cache)
- **src/lib/social/**: Platform-specific social media posting logic
- **src/config/**: Configuration for databases, Redis, QStash, and platforms
- **src/utils/**: Utility functions for file processing, caching, and responses

**Note**: Blog generation logic has been extracted to the `@sgcarstrends/ai` shared package for reuse across API workflows and Admin app.

### Features

The API follows a feature-based architecture in `src/features/`:

- **cars**: Car registration data endpoints
- **coe**: COE bidding results endpoints
- **deregistrations**: Vehicle deregistration data queries
- **health**: Health check endpoint
- **logos**: Car brand logo API (placeholder - awaiting storage migration)
- **months**: Available data months endpoint
- **workflows**: Workflow trigger endpoints
- **newsletter**: Newsletter functionality
- **shared**: Shared feature utilities

**Logos Feature**: The logos feature (`src/features/logos/`) provides car brand logo retrieval with automatic downloads. Uses Vercel Blob for storage and Upstash Redis for caching. Requires `BLOB_READ_WRITE_TOKEN` environment variable. See `packages/logos/CLAUDE.md` for implementation details.

### Workflow Architecture

The API uses a workflow-based system for data processing:

- **Workflow Steps** (`src/lib/workflows/steps/`): Reusable step functions inspired by Vercel WDK's `"use step"` pattern
  - `check-existing-post.ts`: Check if a blog post already exists for a given month and data type
  - `process-task.ts`: Task processing with Redis timestamp tracking (exports `WorkflowStep` interface)
  - `publish-to-all-platforms.ts`: Social media publishing (returns `PublishResults`)
  - `revalidate-cache.ts`: Non-blocking cache revalidation with error handling
- **Data Updaters** (`src/lib/workflows/update-cars.ts`, `src/lib/workflows/update-coe.ts`, `src/lib/workflows/update-deregistration.ts`): Automated data fetching and processing from LTA DataMall
- **Blog Generation** (`src/lib/workflows/posts.ts`): Orchestrates LLM-powered blog post creation using `@sgcarstrends/ai` package
- **Main Workflows** (`src/lib/workflows/cars.ts`, `src/lib/workflows/coe.ts`, `src/lib/workflows/deregistration.ts`): Main workflow orchestrators exposed as routes
- **Social Publishing**: Automated posting to platforms when data updates occur
- **Cache Revalidation**: Triggers granular cache invalidation on the web app after data updates

### Cache Revalidation

Workflows invalidate web app caches using granular cache tags via the `revalidateCache()` step:

**Cars Workflow** invalidates:
- `cars:month:{month}` - Specific month's data
- `cars:year:{year}` - Year-specific data
- `cars:months` - Available months list
- `cars:makes` - Makes list (in case new makes appear)
- `cars:annual` - Annual totals
- `posts:list` - Blog post list (when new post generated)

**COE Workflow** invalidates:
- `coe:results` - All COE results
- `coe:latest` - Latest COE results
- `coe:months` - Available COE months
- `coe:year:{year}` - Year-specific data
- `posts:list` - Blog post list (when new post generated)

**Deregistrations Workflow** invalidates:
- `deregistrations:month:{month}` - Specific month's deregistration data
- `deregistrations:year:{year}` - Year-specific deregistration data
- `deregistrations:months` - Available deregistration months list

See `apps/web/CLAUDE.md` for complete cache tag documentation and the web app's `/api/revalidate` endpoint.

### Authentication & Security

- **Bearer Token Auth**: All /v1 routes require `SG_CARS_TRENDS_API_TOKEN`
- **Workflow Authentication**: Workflow triggers protected by QStash signature verification
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

### Workflow Endpoints

- **POST /workflows/cars**: Car data processing workflow
- **POST /workflows/coe**: COE data processing workflow
- **POST /workflows/deregistrations**: Vehicle deregistration data processing workflow
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
- `QSTASH_CURRENT_SIGNING_KEY`: QStash current signing key for signature verification
- `QSTASH_NEXT_SIGNING_KEY`: QStash next signing key for signature verification
- `WORKFLOWS_BASE_URL`: Base URL for workflow endpoints (e.g., `https://api.dev.aws.sgcarstrends.com/workflows`)
- `NEXT_PUBLIC_SITE_URL`: Web application URL for social media post links (e.g., `https://dev.sgcarstrends.com`)
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob authentication token for logos storage
- `GOOGLE_GENERATIVE_AI_API_KEY`: Google Gemini API key for blog generation (used by Vercel AI SDK)
- `LANGFUSE_PUBLIC_KEY`: Langfuse public key for LLM observability (optional)
- `LANGFUSE_SECRET_KEY`: Langfuse secret key for LLM observability (optional)
- `LANGFUSE_HOST`: Langfuse host URL, defaults to https://cloud.langfuse.com (optional)
- Social media platform tokens for integrations (Discord, LinkedIn, Twitter, Telegram)

## Vercel Related Projects

The API service is configured as a related project for the web application:

**Configuration:**
- Located in `vercel.json` at the API app root
- References web project ID: `prj_RE6GjplQ6imcQuHQ93BmqSBJp6Cg`
- Enables bidirectional project communication

**Purpose:**
- Allows web application to automatically resolve API URLs across environments
- Web app uses `@vercel/related-projects` to dynamically discover API endpoints
- Supports seamless communication between API and web in preview deployments

**Related Documentation:**
- See root `CLAUDE.md` for complete Vercel Related Projects overview
- See `apps/web/CLAUDE.md` for web app integration details

## Code Style

- **TypeScript**: Strict mode with @api path aliases
- **Linting**: Biome with automatic formatting
- **Import Organization**: Built-in modules, external packages, workspace packages, internal imports
- **Error Handling**: HTTPException for known errors, structured JSON responses
- **Async Patterns**: Promise-based with try/catch blocks in workflows

## Workflow Development

Workflows orchestrate data updates, blog generation, and social media posting. See `workflow-management` skill for implementation patterns and best practices.

## Social Media Integration

Platform-specific posting logic in `src/lib/social/*/` for Discord, LinkedIn, Twitter, and Telegram. See `social-media` skill for integration details, webhook management, and content formatting patterns.

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

- **Instrumentation**: Configured in `@sgcarstrends/ai` package via `instrumentation.ts` - OpenTelemetry setup with Langfuse span processor
- **Telemetry**: Enabled in `@sgcarstrends/ai/generate-post.ts` via Vercel AI SDK's experimental telemetry
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

Automated quality scores track content quality, token efficiency, and generation success. All scores visible in Langfuse dashboard as span attributes. See `gemini-blog` skill for scoring criteria and optimization strategies.
