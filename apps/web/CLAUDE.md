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

# Deployment (see `sst-deployment` skill)
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
├── actions/                       # Server actions (newsletter subscription)
├── queries/                       # Data fetching queries (cars, COE, logos)
│   ├── cars/                      # Car data queries with comprehensive tests
│   ├── coe/                       # COE data queries with comprehensive tests
│   ├── logos/                     # Logo queries
│   └── __tests__/                 # Comprehensive query test suite
├── components/                    # Shared React components
│   ├── coe/                       # Shared COE components (latest-coe.tsx for home page)
│   ├── dashboard/                 # Shared dashboard components (navigation, skeletons)
│   ├── shared/                    # Generic shared components (chips, currency, metric-card)
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

#### Centralised vs Co-located

**Keep Centralised When:**

- Component used by 3+ different routes
- Part of design system (use `@sgcarstrends/ui` shared package for shadcn/ui components)
- Shared business logic (`queries/`, `lib/`)
- Server actions used across multiple routes (`actions/`)
- Generic utilities (`components/shared/`)

**Co-locate When:**

- Component only used by single route or route segment
- Action/query specific to one feature area (use `_actions/` or `_queries/` in route folders)
- Utility function only needed in one place

#### Import Strategy

**Always use path aliases** for imports:

```typescript
// ✅ Co-located components via path alias
import {ProgressBar} from "@web/app/blog/_components/progress-bar";
import {KeyStatistics} from "@web/app/(dashboard)/(home)/_components/key-statistics";

// ✅ Shared queries and actions via path alias
import {getCarRegistrations} from "@web/queries/cars";
import {getLatestCOE} from "@web/queries/coe";
import {subscribeAction} from "@web/actions";

// ✅ Shared components via existing alias
import {MetricCard} from "@web/components/shared/metric-card";
import {Button} from "@sgcarstrends/ui/components/button";

// ❌ Avoid relative imports for co-located code
import {ProgressBar} from "../_components/progress-bar"; // Don't use
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

**Cache Components & Optimization** (Next.js 16):

The application implements Next.js 16 Cache Components with `"use cache"` directives for optimal performance:

- **Cache Directives**: All data fetching queries use `"use cache"` with `cacheLife("max")` for static data
- **Cache Tags**: High-level scopes (`CACHE_LIFE.CARS`, `CACHE_LIFE.coe`, `CACHE_LIFE.posts`) for broad cache
  invalidation
- **Tagged Queries**: Filter options, market insights, entity breakdowns, and overview queries include cache tags
- **Simplified Architecture**: Moved from granular cache tags to broad tags to reduce ISR write operations
- **Cache Configuration** (`src/lib/cache.ts`): Defines cache tag constants for cars, COE, and posts domains

**Cache Strategy Best Practices**:

- Use `"use cache"` directive at the top of async functions that fetch data
- Apply `cacheLife("max")` for static or infrequently changing data
- Tag with domain-level scopes (`cacheTag(CACHE_LIFE.CARS)`) for efficient invalidation
- Avoid over-granular tags to minimize ISR write overhead
- See `cache-components` skill for implementation patterns

**Cache Implementation Example**:

```typescript
import {CACHE_LIFE} from "@web/lib/cache";
import {cacheLife, cacheTag} from "next/cache";

export const getDistinctMakes = async () => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_LIFE.CARS);

    return db.selectDistinct({make: cars.make}).from(cars).orderBy(cars.make);
};
```

This pattern is used across all query functions in `src/queries/cars/` and `src/queries/coe/` directories

**Data Queries**: Organized in `src/queries/` directory with comprehensive test coverage:

- **Car Queries** (`queries/cars/`): Registration data, market insights, makes, yearly statistics, filter options
- **COE Queries** (`queries/coe/`): Historical results, latest results, available months, PQP rates
- **Logo Queries** (`queries/logos/`): Dynamic logo loading via `@sgcarstrends/logos` package with Vercel Blob storage
- All queries include comprehensive unit tests in `queries/__tests__/`

**Car Logos**: Dynamic logo loading via `@sgcarstrends/logos` package with Vercel Blob storage:

- Logo queries in `src/queries/logos/` fetch logos from Vercel Blob
- `getLogoUrlMap()` pre-fetches all logos for the makes list page
- `getCarLogo(brand)` fetches individual logos for make detail pages
- Logos cached in Redis (24-hour TTL for individual logos, 1-hour TTL for list)
- Automatic fallback when logos are unavailable (components hide logo display)

**Server Actions**: Organized in `src/actions/` directory for write operations:

- Newsletter subscription (`actions/newsletter/subscribe.ts`)
- Blog-specific actions co-located in `src/app/blog/_actions/` (view counting, related posts)

**Social Media Integration**: Implements domain-based redirect routes in `src/app/(social)/` that provide trackable,
SEO-friendly URLs for all social media platforms. Each route includes standardised UTM parameters for analytics
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

**Typography System**: Semantic typography components in `src/components/typography.tsx` implementing a modern design
philosophy inspired by Vercel, Linear, and Stripe. Uses lighter font weights (semibold for primary headings, medium for
secondary headings/labels, normal for body text) with hierarchy driven by size and spacing.
See [Typography System](#typography-system) section below.

**UI Components**: Base UI components (shadcn/ui) are imported from the shared `@sgcarstrends/ui` package. HeroUI
components are also used throughout the application for professional design system integration.

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

### Typography System

A modern, semantic typography system for consistent visual hierarchy across the application.

**Design Philosophy**:

- Lighter font weights relying on size and spacing for hierarchy
- Inspired by Vercel, Linear, and Stripe design systems
- Principles: Semibold (600) for primary headings, Medium (500) for secondary headings/labels, Normal (400) for body
  text
- Bold reserved for data emphasis (numbers, metrics)
- **HeroUI Semantic Colours**: All components include default theme-adaptive colours that can be overridden via
  `className`

**Component Reference**:

**Headings**:

- `Typography.H1`: Page titles, primary headings (font-semibold text-4xl text-foreground lg:text-5xl)
- `Typography.H2`: Section titles, major sections (font-semibold text-3xl text-foreground)
- `Typography.H3`: Subsection titles, card titles (font-medium text-2xl text-foreground)
- `Typography.H4`: Small headings, nested sections (font-medium text-xl text-default-900)

**Body Text**:

- `Typography.TextLg`: Large body text, lead paragraphs (text-lg text-foreground leading-relaxed)
- `Typography.Text`: Standard body text, paragraphs (text-base text-foreground leading-7)
- `Typography.TextSm`: Small body text, secondary descriptions (text-sm text-default-600 leading-6)

**UI Labels**:

- `Typography.Label`: Form labels, navigation items, tabs (font-medium text-sm text-foreground)
- `Typography.Caption`: Metadata text, timestamps, footnotes (text-xs text-muted-foreground leading-tight)

**Content Elements** (legacy, for backward compatibility):

- `Typography.P`: Paragraphs with bottom margin (not-first:mt-6)
- `Typography.Blockquote`: Quoted text with left border
- `Typography.List`: Unordered lists with disc markers
- `Typography.InlineCode`: Inline code snippets (font-medium monospace)
- `Typography.Lead`: Lead paragraphs (text-xl text-muted-foreground)

**Usage Examples**:

```typescript
import Typography from "@web/components/typography";

// Page heading
<Typography.H1>COE
Overview < /Typography.H1>

// Section heading
< Typography.H2 > Fun
Facts < /Typography.H2>

// Card title
< Typography.H3 > Category
A
vs
B < /Typography.H3>

// Lead paragraph
< Typography.TextLg > Explore
COE
trends
and
analysis. < /Typography.TextLg>

// Body text
< Typography.Text > The
latest
COE
results
show
...
</Typography.Text>

// Small helper text
< Typography.TextSm > Updated
daily
from
LTA < /Typography.TextSm>

// Form label
< Typography.Label > Select
Month < /Typography.Label>

// Metadata/timestamp
< Typography.Caption > Last
updated: 29
Oct
2025 < /Typography.Caption>
```

**When to Use Each Component**:

- Use `H1` for exactly one primary page title
- Use `H2` for major section groupings
- Use `H3` for card titles and subsections
- Use `H4` for nested section headers
- Use `TextLg` for introductions and emphasised content
- Use `Text` for standard body content and descriptions
- Use `TextSm` for secondary info and helper text
- Use `Label` for form fields and UI controls
- Use `Caption` for timestamps, sources, and footnotes

**HeroUI Semantic Colour System**:

All Typography components include default colours from HeroUI's semantic colour palette:

- `text-foreground`: Theme-adaptive primary text colour (auto-adjusts for light/dark mode)
- `text-default-900`: Darkest shade for strong emphasis (H4 headings)
- `text-default-600`: Medium shade for secondary text (TextSm for links, footer text)
- `text-muted-foreground`: Muted colour for metadata and captions (Caption, Lead components)

These defaults provide proper visual hierarchy while allowing override via `className` prop when specific colours like
`text-primary` are needed for emphasis.

**Migration Notes**:

- Legacy components (`Small`, `Muted`) have been replaced with semantic alternatives (`Label`, `Caption`)
- Existing `P` component maintained for backward compatibility
- Removed border-bottom from `H2` for cleaner appearance
- Font weight reductions (H1/H2 remain semibold; H3/H4 changed to medium) for modern hierarchy
- All components now include HeroUI semantic colour defaults for consistent theming

### Layout & Spacing Conventions

A standardized approach to spacing and layout for consistent, maintainable component design.

**Design Philosophy**:

- Modern flexbox/grid-based layouts with gap utilities
- Predictable spacing without margin collapsing issues
- Consistent even-numbered spacing scale
- Avoid legacy margin-based spacing patterns

**Vertical Spacing Best Practices**:

- **Avoid `space-y-*`**: Use `flex flex-col gap-*` instead for better layout control
- **Avoid `margin-top`**: Use `gap-*` or `padding` for spacing between elements
- **Prefer even gap values**: `gap-2`, `gap-4`, `gap-6`, `gap-8` (odd values like `gap-1` only sparingly for specific
  cases)

**Guidelines**:

- ✅ Use `flex flex-col gap-*` for vertical spacing in containers
- ✅ Use `gap-*` for both horizontal and vertical spacing in flex/grid layouts
- ✅ Use `padding` for internal component spacing
- ✅ Prefer even gap values for consistency: `gap-2` (0.5rem), `gap-4` (1rem), `gap-6` (1.5rem), `gap-8` (2rem)
- ❌ Avoid `space-y-*` utilities (creates margin-based spacing with potential collapsing issues)
- ❌ Avoid `mt-*`/`margin-top` for spacing between sibling elements (use `gap-*` instead)
- ⚠️ Exception: `mt-*` acceptable only for icon alignment with text (e.g., `mt-1` for small icons)

**Rationale**: `gap-*` provides more predictable spacing in modern layouts, works consistently with flexbox/grid, and
avoids margin collapsing issues that can occur with `space-y-*` and `margin-top`.

**Examples**:

```typescript
// ✅ Preferred: flex with gap for vertical spacing
<div className = "flex flex-col gap-4" >
    <CardComponent / >
    <CardComponent / >
    <CardComponent / >
    </div>

    // ✅ Grid with even gap values
    < div
className = "grid grid-cols-2 gap-6" >
    <Item / >
    <Item / >
    </div>

    // ✅ Horizontal flex with gap
    < div
className = "flex items-center gap-2" >
<Icon className = "size-4" / >
    <span>Text
content < /span>
< /div>

// ❌ Avoid: space-y utilities (legacy pattern)
< div
className = "space-y-4" >
<CardComponent / >
<CardComponent / >
</div>

// ❌ Avoid: margin-top for sibling spacing
< div >
<CardComponent / >
<CardComponent className = "mt-4" / >
    </div>

    // ⚠️ Acceptable exception: icon vertical alignment
    < div
className = "flex items-center gap-2" >
<Icon className = "mt-1 size-4" / >
<span className = "text-sm" > Aligned
text < /span>
< /div>
```

**Spacing Scale Reference**:

- `gap-1` (0.25rem / 4px) - Tight spacing, use sparingly
- `gap-2` (0.5rem / 8px) - Small spacing, compact lists
- `gap-4` (1rem / 16px) - Standard spacing, most common use
- `gap-6` (1.5rem / 24px) - Medium spacing, section groups
- `gap-8` (2rem / 32px) - Large spacing, major sections

**Migration from Legacy Patterns**:

When refactoring existing code:

1. Replace `<div className="space-y-4">` with `<div className="flex flex-col gap-4">`
2. Remove `mt-*` from child elements when parent uses `gap-*`
3. Convert `space-y-*` values to equivalent `gap-*` (space-y-2 → gap-2, space-y-4 → gap-4, etc.)
4. Keep only icon alignment `mt-*` cases (document with comments if needed)

### Blog Features

**Content Management**:

- AI-generated blog posts from LLM analysis of market data
- MDX rendering with GitHub Flavored Markdown support
- Dynamic Open Graph image generation for social sharing
- SEO-optimised metadata with structured data

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

**Test Naming Convention**: All test descriptions should start with "should" to describe expected behavior:

```typescript
// ✅ Good
it("should render title and children", () => {
});
it("should display empty state when data is empty", () => {
});

// ❌ Avoid
it("renders title and children", () => {
});
it("displays empty state when data is empty", () => {
});
```

**E2E Tests**: Playwright tests in `tests/` directory covering critical user flows.

**Coverage**: Generate coverage reports with `pnpm test:coverage`.

### Environment Configuration

Environment variables managed through SST config:

- `DATABASE_URL`: Neon PostgreSQL connection
- `UPSTASH_REDIS_REST_URL/TOKEN`: Redis caching
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage access for car logos (via `@sgcarstrends/logos`)
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

Multi-stage deployment via SST with domain mapping:

- **dev**: `dev.sgcarstrends.com`
- **staging**: `staging.sgcarstrends.com`
- **prod**: `sgcarstrends.com` (apex domain)

See `sst-deployment` skill for deployment workflows and infrastructure details.

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
