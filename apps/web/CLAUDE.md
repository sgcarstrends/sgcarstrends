# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Essential commands for development:

```bash
# Development
pnpm dev                 # Start development server with Turbopack
pnpm build              # Build for production with Turbopack
pnpm start              # Start production server

# Testing
pnpm test               # Run unit tests with Vitest
pnpm test:run           # Run tests once
pnpm test:coverage      # Run tests with coverage report
pnpm test:e2e           # Run Playwright E2E tests
pnpm test:e2e:ui        # Run E2E tests with Playwright UI

# Code Quality
pnpm lint               # Run ESLint

# Database
pnpm migrate            # Run Drizzle database migrations

# Deployment
pnpm deploy:dev         # Deploy to dev environment
pnpm deploy:staging     # Deploy to staging environment
pnpm deploy:prod        # Deploy to production environment
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and React 19
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS v4 with HeroUI components
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Deployment**: SST on AWS (Singapore region)

### Key Directories

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

### Data Architecture

**Database**: Uses Drizzle ORM with PostgreSQL for car registration data and COE bidding results. Database connection configured in `src/config/db.ts`.

**State Management**: Zustand store with persistence in `src/app/store.ts` manages:
- Date selection across components
- COE category filters
- Notification preferences

**Caching**: Redis (Upstash) for API response caching and rate limiting.

### API Structure

External API integration through `src/utils/api/` for:
- Car comparison data
- Market share analytics
- Top performer statistics

### Component Patterns

**UI Components**: Located in `src/components/ui/` following HeroUI patterns with professional design system.

**Charts**: Recharts-based components in `src/components/charts/` for data visualization.

**Layout**: Shared layout components (Header, Footer) with responsive design.

### Testing Strategy

**Unit Tests**: Co-located with components using Vitest and Testing Library. Run tests before commits.

**E2E Tests**: Playwright tests in `tests/` directory covering critical user flows.

**Coverage**: Generate coverage reports with `pnpm test:coverage`.

### Environment Configuration

Environment variables managed through SST config:
- `DATABASE_URL`: Neon PostgreSQL connection
- `UPSTASH_REDIS_REST_URL/TOKEN`: Redis caching
- `SG_CARS_TRENDS_API_TOKEN`: External API authentication
- `APP_ENV`: Environment stage (dev/staging/prod)

### Deployment

Multi-stage deployment via SST:
- **dev**: `dev.sgcarstrends.com`
- **staging**: `staging.sgcarstrends.com` 
- **prod**: `sgcarstrends.com`

Infrastructure uses AWS Lambda with ARM64 architecture and CloudFlare DNS.

## Development Notes

- **Package Manager**: Uses pnpm (version 10.8.0)
- **TypeScript**: Strict mode enabled
- **Turbopack**: Enabled for faster builds and development
- **Feature Flags**: Controlled via `NEXT_PUBLIC_FEATURE_FLAG_UNRELEASED`
- **Analytics**: Integrated with Google Analytics and custom analytics

## UI Component Strategy

The codebase uses HeroUI as the primary component library:

- **New Features**: Use HeroUI components with TypeScript-first approach
- **Component Selection**: Leverage HeroUI's professional design system for analytics interfaces
- **Data Visualisation**: Utilise HeroUI's advanced table and chart components for market data
- **Customisation**: Apply HeroUI's theming system to match Singapore car market branding
- **Performance**: Take advantage of HeroUI's tree-shakeable, optimised components
- **Legacy Code**: Gradually migrate existing shadcn/ui components to HeroUI equivalents

## Documentation Reference

When Claude needs to refer to library documentation, use the Context7 MCP server:

1. **Resolve Library ID**: Use `mcp__context7__resolve-library-id` to find the correct library identifier
2. **Fetch Documentation**: Use `mcp__context7__get-library-docs` with the resolved ID to get up-to-date documentation
3. **Common Libraries**: For this project, frequently referenced libraries include:
   - Next.js (`/vercel/next.js`)
   - React (`/facebook/react`)
   - Tailwind CSS (`/tailwindlabs/tailwindcss`)
   - Drizzle ORM (`/drizzle-team/drizzle-orm`)
   - Zustand (`/pmndrs/zustand`)
   - Vitest (`/vitest-dev/vitest`)
   - Playwright (`/microsoft/playwright`)