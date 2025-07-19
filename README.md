# SG Cars Trends

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

This monorepo provides a complete platform for SG Cars Trends, tracking Singapore's car registration statistics and Certificate of Entitlement (COE) data. The system includes:

- **Web Application**: Next.js frontend with interactive charts and analytics
- **REST API**: Data access endpoints for car registrations and COE results
- **Integrated Data Updater**: Workflow-based system for fetching and processing LTA data
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter
- **Documentation**: Comprehensive developer documentation

## Project Structure

```
sgcarstrends/
├── apps/
│   ├── api/          # Unified API service with integrated updater
│   │   ├── src/v1/          # API endpoints for data access
│   │   └── src/updater/     # Data update workflows and social media integration
│   ├── web/          # Next.js frontend application
│   │   ├── src/app/         # Next.js App Router pages and layouts
│   │   ├── src/components/  # React components with tests
│   │   └── src/utils/       # Web-specific utility functions
│   └── docs/         # Mintlify documentation site
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utility functions
```

## Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: HeroUI (NextUI successor)
- **Styling**: Tailwind CSS v4
- **Backend**: Node.js, TypeScript
- **API Framework**: Hono
- **Database**: Neon Serverless PostgreSQL with Drizzle ORM
- **Caching**: Upstash Redis
- **Infrastructure**: SST (Serverless Stack)
- **Scheduling**: QStash Workflows
- **Package Management**: pnpm workspace
- **Build Tools**: Turbo
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: Biome

## Documentation

📚 **Complete API documentation is available at: [docs.sgcarstrends.com](https://docs.sgcarstrends.com)**

- **[Getting Started](https://docs.sgcarstrends.com/quickstart)** - Quick start guide and authentication
- **[API Reference](https://docs.sgcarstrends.com/api-reference/overview)** - Complete endpoint documentation
- **[Developer Guides](https://docs.sgcarstrends.com/guides/data-models)** - Data models, filtering, and analytics
- **[Examples](https://docs.sgcarstrends.com/examples/javascript)** - Code examples in multiple languages

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sgcarstrends/backend.git
cd backend

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

### Data Access
- `GET /v1/cars` - Car registration data
- `GET /v1/coe` - COE bidding results
- `GET /v1/coe/pqp` - COE Prevailing Quota Premium rates
- `GET /v1/makes` - Car manufacturers
- `GET /v1/months/latest` - Latest month with data

### Updater (Authenticated)
- `POST /updater/workflows/trigger` - Trigger data update workflows
- `POST /updater/workflow/cars` - Car data workflow
- `POST /updater/workflow/coe` - COE data workflow
- `POST /updater/linkedin` - LinkedIn posting webhook
- `POST /updater/twitter` - Twitter posting webhook
- `POST /updater/discord` - Discord posting webhook
- `POST /updater/telegram` - Telegram posting webhook

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/258928105d0fb955b3e6c42387ac59340df721e8.svg "Repobeats analytics image")

## License

MIT