# SGCarsTrends API

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sgcarstrends_api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=sgcarstrends_api)

## Overview

SGCarsTrends API provides data and insights about car trends in Singapore. Built with Hono framework, it includes:

- RESTful endpoints for car registration and COE data
- QStash-powered workflows for data updates
- Social media integration (Discord, LinkedIn, Twitter, Telegram)
- AI-powered blog generation using Vercel AI SDK with Google Gemini

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm 10.22.0

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Run the development server
   ```bash
   pnpm dev
   ```

## Development

### Testing

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

### Code Quality

```bash
pnpm lint              # Lint code with Biome
```

### Deployment

```bash
pnpm deploy:dev        # Deploy to dev stage
pnpm deploy:staging    # Deploy to staging stage
pnpm deploy:prod       # Deploy to production
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
