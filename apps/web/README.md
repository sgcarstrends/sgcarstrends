# SG Cars Trends

A comprehensive analytics platform for Singapore's car market, providing insights into car registrations, COE (
Certificate of Entitlement) bidding results, and market trends.

## Features

- **Car Registration Analytics**: Track registrations by make, fuel type, and vehicle type
- **COE Bidding Results**: Monitor COE premiums and bidding trends
- **Trend Analysis**: Month-over-month and year-over-year comparisons
- **Interactive Charts**: Responsive data visualisation with Recharts
- **Geographic Insights**: User analytics by location
- **Performance Optimization**: Next.js 16 Cache Components with `"use cache"` directives for optimal data fetching

## Tech Stack

- **Next.js 16** with App Router, React 19, and Cache Components
- **TypeScript** with strict type checking
- **Tailwind CSS v4** for styling
- **Drizzle ORM** with PostgreSQL (Neon Database)
- **Zustand** for state management
- **HeroUI** components with professional design system
- **Vitest** for unit testing, **Playwright** for E2E testing
- **SST** for AWS deployment

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.8.0+ (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
pnpm migrate
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development
- `pnpm dev` - Start development server (uses Turbopack)
- `pnpm build` - Build for production (uses Turbopack)
- `pnpm start` - Start production server

### Testing
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run unit tests with coverage
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm test:e2e:ui` - Run E2E tests with Playwright UI

### Code Quality
- `pnpm lint` - Run ESLint

### Database
- `pnpm migrate` - Run database migrations

### Deployment
- `pnpm deploy:dev` - Deploy to dev environment
- `pnpm deploy:staging` - Deploy to staging environment
- `pnpm deploy:prod` - Deploy to production environment

## Project Structure

```
src/
├── app/               # Next.js App Router - pages, layouts, API routes
│   ├── (home)/       # Home page route group
│   ├── api/          # API routes (analytics, OG images, revalidation)
│   ├── cars/         # Car-related pages with parallel routes
│   ├── coe/          # COE (Certificate of Entitlement) pages
│   └── store/        # Zustand store slices
├── components/       # React components with tests
├── config/          # App configuration (DB, Redis, navigation)
├── schema/          # Drizzle database schemas
├── types/           # TypeScript definitions
└── utils/           # Utility functions with comprehensive tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting: `pnpm test:coverage && pnpm lint`
6. Submit a pull request

## Deployment

Multi-stage deployment via SST on AWS with CloudFlare DNS:

- **dev**: [dev.sgcarstrends.com](https://dev.sgcarstrends.com)
- **staging**: [staging.sgcarstrends.com](https://staging.sgcarstrends.com)
- **prod**: [sgcarstrends.com](https://sgcarstrends.com)

Infrastructure uses AWS Lambda with ARM64 architecture. The deployment process is automated through the configured CI/CD pipeline.

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/a95b438e1fccbaeed2d9128859b7b13f6b6d531f.svg "Repobeats analytics image")