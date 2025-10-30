# CLAUDE.md - Web Application

This file provides guidance to Claude Code (claude.ai/code) when working with the web application in this repository.

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
pnpm lint               # Run Next.js ESLint
pnpm format             # Format code with Biome

# Deployment
pnpm deploy:dev         # Deploy to dev environment
pnpm deploy:staging     # Deploy to staging environment
pnpm deploy:prod        # Deploy to production environment
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16.0.0 with App Router and React 19.2.0
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS v4 with HeroUI components
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Deployment**: SST on AWS (Singapore region)

### Key Directories

```
src/
├── app/                           # Next.js App Router - pages, layouts, API routes
│   ├── (dashboard)/
│   │   ├── (home)/
│   │   │   └── _components/       # Home page-specific components (co-located)
│   │   ├── cars/
│   │   │   └── _components/       # Cars route-specific components (co-located)
│   │   └── coe/
│   │       └── _components/       # COE route-specific components (co-located)
│   ├── (social)/                  # Social media redirect routes with UTM tracking
│   ├── api/                       # API routes (analytics, OG images, revalidation)
│   ├── blog/
│   │   ├── _actions/              # Blog-specific server actions (co-located)
│   │   └── _components/           # Blog-specific components (co-located)
│   └── store/                     # Zustand store slices
├── actions/                       # Shared server actions (cars, COE)
├── components/                    # Shared React components
│   ├── coe/                       # Shared COE components (latest-coe.tsx for home page)
│   ├── dashboard/                 # Shared dashboard components (navigation, skeletons)
│   ├── shared/                    # Generic shared components (chips, currency, metric-card)
│   ├── ui/                        # shadcn/ui base components (DO NOT MODIFY)
│   └── [others]                   # Shared components used across multiple routes
├── config/                        # App configuration (DB, Redis, navigation)
├── lib/                           # Shared data fetching and business logic
├── schema/                        # Drizzle database schemas
├── types/                         # TypeScript definitions
└── utils/                         # Utility functions with comprehensive tests
```

### Component Co-location Strategy

This application follows **Next.js 15/16 co-location best practices** using private folders (underscore prefix):

#### Co-located Components (`_components/`)

Route-specific components live alongside their consuming routes using private folders:

- **Home**: `app/(dashboard)/(home)/_components/` - Key statistics, recent posts
- **Blog**: `app/blog/_components/` - Progress bar, view counter, related posts, blog list
- **Cars**: `app/(dashboard)/cars/_components/` - Category tabs, make selectors, trend charts
- **COE**: `app/(dashboard)/coe/_components/` - COE categories, premium charts, PQP components

#### Co-located Actions (`_actions/`)

Route-specific server actions use private folders:

- **Blog**: `app/blog/_actions/` - View counting, related posts, tag management

#### Centralized vs Co-located

**Keep Centralized When:**
- Component used by 3+ different routes
- Part of design system (`components/ui/` - shadcn/ui)
- Shared business logic (`actions/`, `lib/`)
- Generic utilities (`components/shared/`)

**Co-locate When:**
- Component only used by single route or route segment
- Action/query specific to one feature area
- Utility function only needed in one place

#### Import Strategy

**Always use path aliases** for imports:

```typescript
// ✅ Co-located components via path alias
import { ProgressBar } from "@web/app/blog/_components/progress-bar";
import { KeyStatistics } from "@web/app/(dashboard)/(home)/_components/key-statistics";

// ✅ Shared components via existing alias
import { MetricCard } from "@web/components/shared/metric-card";
import { Button } from "@web/components/ui/button";

// ❌ Avoid relative imports for co-located code
import { ProgressBar } from "../_components/progress-bar"; // Don't use
```

#### Private Folder Convention

All non-route folders in `app/` use underscore prefix to prevent routing conflicts:

- `_components/` - React components
- `_actions/` - Server actions
- `_queries/` - Data fetching functions (if needed)
- `_utils/` - Route-specific utilities (if needed)

### Data Architecture

**Database**: Uses Drizzle ORM with PostgreSQL for car registration data, COE bidding results, and blog posts. Database
connection configured in `src/config/db.ts`.

**State Management**: Zustand store with persistence in `src/app/store.ts` manages:

- Date selection across components
- COE category filters
- Notification preferences

**Caching**: Redis (Upstash) for API response caching, rate limiting, and blog view tracking.

**Blog Functionality**: Server actions in `src/app/blog/_actions/` handle:

- Blog post retrieval and filtering
- View counting with Redis-based tracking
- Related posts discovery using tag-based associations
- SEO metadata and reading time calculations

**Social Media Integration**: Implements domain-based redirect routes in `src/app/(social)/` that provide trackable,
SEO-friendly URLs for all social media platforms. Each route includes standardized UTM parameters for analytics
tracking.

### API Structure

External API integration through `src/utils/api/` for:

- Car comparison data
- Market share analytics
- Top performer statistics

### UTM Tracking

**UTM Utilities** (`src/utils/utm.ts`):
- **External Campaigns**: `createExternalCampaignURL()` for email newsletters and marketing campaigns
- **Parameter Reading**: `useUTMParams()` React hook for future analytics implementation (currently unused)
- **Best Practices**: Follows industry standards with no UTM tracking on internal navigation
- **Type Safety**: Full TypeScript support with `UTMParams` interface and nuqs integration

### Component Patterns

**UI Components**: Located in `src/components/ui/` following HeroUI patterns with professional design system.

**Charts**: Recharts-based components in `src/components/charts/` for data visualization.

**Dashboard Components**: Interactive components for the homepage including:

- Section tabs with responsive overflow handling and dynamic font sizing
- Latest COE results display with card-based layout
- Recent posts sidebar with link navigation
- Key statistics and yearly registration charts

**Blog Components**: Co-located components in `src/app/blog/_components/` including:

- Progress bar for reading progress tracking
- View counter with Redis-backed analytics
- Related posts recommendations
- AI content attribution badges

**Layout**: Shared layout components (Header, Footer) with responsive design and blog navigation.

### Blog Features

**Content Management**:

- AI-generated blog posts from LLM analysis of market data
- MDX rendering with GitHub Flavored Markdown support
- Dynamic Open Graph image generation for social sharing
- SEO-optimized metadata with structured data

**Reader Experience**:

- Reading progress bar with smooth animations
- Estimated reading time calculations
- View counter with privacy-focused Redis tracking
- Related posts based on content tags and topics

**Technical Implementation**:

- Static generation with ISR for optimal performance
- Custom MDX components for enhanced formatting
- Automatic table of contents generation
- Responsive design with mobile-first approach

**SEO & Social**:

- Dynamic Open Graph images for each blog post
- JSON-LD structured data for search engines
- Canonical URLs and social media meta tags
- Automatic sitemap integration

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
- `NEXT_PUBLIC_APP_ENV`: Client-side environment stage
- `NEXT_PUBLIC_FEATURE_FLAG_UNRELEASED`: Feature flag for unreleased features
- `VERCEL_ENV`: Vercel's automatic environment detection (production/preview/development)

#### Production Environment Detection

The application uses multiple environment variables to determine production status:

- Social media redirects and production-only features activate when:
  - `VERCEL_ENV === "production"` (Vercel deployment), OR
  - `NEXT_PUBLIC_APP_ENV === "prod"` (SST production stage)

#### VERCEL_URL Support

The application supports Vercel's automatic URL environment variables:

- `NEXT_PUBLIC_VERCEL_URL`: Client-side deployment URL (e.g., `my-site.vercel.app`) without `https://` protocol
- `SITE_URL` configuration automatically uses `NEXT_PUBLIC_VERCEL_URL` when `NEXT_PUBLIC_SITE_URL` is not set

#### Vercel Related Projects Integration

The web application uses Vercel Related Projects for automatic API URL resolution:

**Configuration:**
- Located in `vercel.json` at the web app root
- References API project ID: `prj_fyAvupEssH3LO4OQFDWplinVFlaI`
- Uses `@vercel/related-projects` package for dynamic URL resolution

**Implementation:**
- API URL automatically resolved via `withRelatedProject()` in `src/config/index.ts`
- Works across all environments: dev, staging, production, and preview deployments
- Falls back to `NEXT_PUBLIC_API_URL` or default `https://api.sgcarstrends.com` if Related Projects unavailable

**Benefits:**
- No manual API URL configuration needed in Vercel deployments
- Preview deployments automatically connect to correct API environment
- Type-safe with full TypeScript support
- Backward compatible with SST deployments

### Deployment

Multi-stage deployment via SST:

- **dev**: `dev.sgcarstrends.com`
- **staging**: `staging.sgcarstrends.com`
- **prod**: `sgcarstrends.com` (apex domain)

Infrastructure uses AWS Lambda with ARM64 architecture and Cloudflare DNS.

## Development Notes

- **Package Manager**: Uses pnpm v10.13.1
- **TypeScript**: Strict mode enabled
- **Turbopack**: Enabled for faster builds and development
- **Feature Flags**: Controlled via `NEXT_PUBLIC_FEATURE_FLAG_UNRELEASED`
- **Analytics**: Integrated with Umami analytics

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
    - next-mdx-remote (for MDX blog content rendering)
