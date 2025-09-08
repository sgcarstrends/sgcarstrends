# SG Cars Trends

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

This monorepo provides a complete platform for SG Cars Trends, tracking Singapore's car registration statistics and Certificate of Entitlement (COE) data. The system includes:

- **Web Application**: Next.js 15 frontend with interactive charts, analytics, and AI-generated blog content
- **REST API**: Hono-based API with type-safe endpoints for car registrations and COE results
- **Integrated Data Updater**: QStash workflow-based system for fetching and processing LTA data
- **LLM Blog Generation**: Automated blog post creation using Google Gemini AI for market insights
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter with trackable redirect routes
- **Infrastructure**: SST v3 serverless deployment on AWS with multi-stage environments
- **Documentation**: Comprehensive developer documentation with Mintlify

## Project Structure

```
sgcarstrends/
├── apps/
│   ├── api/          # Unified API service with integrated updater
│   │   ├── src/v1/          # API endpoints for data access
│   │   ├── src/lib/         # Workflows, social media, and LLM blog generation
│   │   ├── src/routes/      # Workflow endpoints and webhooks
│   │   ├── src/trpc/        # Type-safe tRPC router with authentication
│   │   └── src/config/      # Database, Redis, QStash configurations
│   ├── web/          # Next.js 15 frontend application
│   │   ├── src/app/         # Next.js App Router pages and layouts
│   │   │   ├── (social)/    # Social media redirect routes with UTM tracking
│   │   │   └── blog/        # Blog pages with AI-generated content
│   │   ├── src/components/  # React components with comprehensive tests
│   │   ├── src/actions/     # Server actions for blog and analytics
│   │   └── src/utils/       # Web-specific utility functions
│   ├── admin/        # Administrative interface for content management
│   └── docs/         # Mintlify documentation site
├── packages/
│   ├── database/     # Database schema and migrations (Drizzle ORM)
│   │   ├── src/db/          # Schema definitions for all tables
│   │   └── migrations/      # Database migration files
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utility functions and Redis configuration
├── infra/            # SST v3 infrastructure configuration
│   ├── api.ts              # API service configuration
│   ├── web.ts              # Web application configuration
│   └── router.ts           # Domain routing and DNS management
```

## Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: HeroUI (NextUI successor) with professional design system
- **Styling**: Tailwind CSS v4 with custom configuration
- **Backend**: Node.js 22, TypeScript with strict mode
- **API Framework**: Hono with OpenAPI documentation
- **Database**: Neon Serverless PostgreSQL with Drizzle ORM
- **Caching**: Upstash Redis for API responses and analytics
- **Infrastructure**: SST v3 (Serverless Stack) on AWS
- **Scheduling**: QStash Workflows for data processing
- **LLM Integration**: Google Gemini AI for blog content generation
- **Package Management**: pnpm workspace
- **Build Tools**: Turbopack for fast development builds
- **Testing**: Vitest (unit), Playwright (E2E) with comprehensive coverage
- **Linting**: Biome for consistent code style

## Documentation

📚 **Complete API documentation is available at: [docs.sgcarstrends.com](https://docs.sgcarstrends.com)**

- **[Getting Started](https://docs.sgcarstrends.com/quickstart)** - Quick start guide and authentication
- **[API Reference](https://docs.sgcarstrends.com/api-reference/overview)** - Complete endpoint documentation
- **[Developer Guides](https://docs.sgcarstrends.com/guides/data-models)** - Data models, filtering, and analytics
- **[Examples](https://docs.sgcarstrends.com/examples/javascript)** - Code examples in multiple languages

### Development Documentation

For developers working on this codebase, detailed component-specific guidance is available:

- **[Root CLAUDE.md](CLAUDE.md)** - Overall project guidance and conventions
- **[API Service](apps/api/CLAUDE.md)** - Hono framework, workflows, tRPC, and social media integration
- **[Web Application](apps/web/CLAUDE.md)** - Next.js development, HeroUI components, and blog features
- **[Database Package](packages/database/CLAUDE.md)** - Schema management, migrations, and TypeScript integration
- **[Infrastructure](infra/CLAUDE.md)** - SST deployment, AWS configuration, and domain management

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sgcarstrends/sgcarstrends.git
cd sgcarstrends

# Install dependencies
pnpm install
```

### Development

```bash
# Run all applications in development mode
pnpm dev

# Run specific applications
pnpm -F @sgcarstrends/api dev    # API service only
pnpm web:dev                     # Web application only
pnpm docs:dev                    # Documentation site only

# Build all applications
pnpm build

# Testing
pnpm test          # Run all unit tests
pnpm test:coverage # Run tests with coverage
pnpm test:e2e      # Run E2E tests (web app)
pnpm test:e2e:ui   # Run E2E tests with UI

# Code quality
pnpm lint          # Run linting on all packages

# Deployment
pnpm -F @sgcarstrends/api deploy     # Deploy API service
pnpm web:deploy:dev                  # Deploy web to dev
pnpm web:deploy:staging              # Deploy web to staging
pnpm web:deploy:prod                 # Deploy web to production
```

## API Endpoints

### Public Endpoints
- `GET /` - Scalar API documentation interface
- `GET /docs` - OpenAPI specification
- `GET /health` - Health check endpoint

### Data Access (Authenticated)
- `GET /v1/cars` - Car registration data with filtering
- `GET /v1/coe` - COE bidding results
- `GET /v1/coe/pqp` - COE Prevailing Quota Premium rates
- `GET /v1/makes` - Car manufacturers
- `GET /v1/months/latest` - Latest month with data

### Workflow System (Authenticated)
- `POST /workflows/trigger` - Trigger data update workflows
- `POST /workflows/cars` - Car data processing workflow
- `POST /workflows/coe` - COE data processing workflow
- `POST /workflows/linkedin` - LinkedIn posting webhook
- `POST /workflows/twitter` - Twitter posting webhook
- `POST /workflows/discord` - Discord posting webhook
- `POST /workflows/telegram` - Telegram posting webhook

### tRPC (Authenticated)
- `POST /trpc/*` - Type-safe tRPC procedures with bearer authentication

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/258928105d0fb955b3e6c42387ac59340df721e8.svg "Repobeats analytics image")

## License

MIT