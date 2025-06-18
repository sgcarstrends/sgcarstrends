# SG Cars Trends Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

This monorepo provides a unified backend service for SG Cars Trends, tracking Singapore's car registration statistics and Certificate of Entitlement (COE) data. The system includes:

- **REST API**: Data access endpoints for car registrations and COE results
- **Integrated Data Updater**: Workflow-based system for fetching and processing LTA data
- **Social Media Integration**: Automated posting to Discord, LinkedIn, Telegram, and Twitter

## Project Structure

```
backend/
├── apps/
│   └── api/          # Unified API service with integrated updater
│       ├── src/v1/          # API endpoints for data access
│       └── src/updater/     # Data update workflows and social media integration
├── packages/
│   ├── schema/       # Database schema using Drizzle ORM
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utility functions
```

## Technologies

- **Backend**: Node.js, TypeScript
- **Framework**: Hono
- **Database**: Neon Serverless PostgreSQL with Drizzle ORM
- **Caching**: Upstash Redis
- **Infrastructure**: SST (Serverless Stack)
- **Scheduling**: QStash Workflows
- **Package Management**: pnpm workspace
- **Build Tools**: Turbo
- **Testing**: Vitest
- **Linting**: Biome

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
# Run the unified API service
pnpm -F @sgcarstrends/api dev

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Deploy the API (includes updater functionality)
pnpm -F @sgcarstrends/api deploy
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