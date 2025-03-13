# SG Cars Trends Updater - Developer Reference Guide

## Project Overview
SG Cars Trends Updater Service fetches, processes, and stores Singapore vehicle registration data and Certificate of Entitlement (COE) bidding results from LTA DataMall.

## Commands
- Build: `pnpm build`
- Develop: `pnpm dev` (starts SST dev environment)
- Lint: `pnpm lint` (uses Biome)
- Test all: `pnpm test`
- Test watch: `pnpm test:watch`
- Test coverage: `pnpm test:coverage`
- Run single test: `pnpm test -- src/utils/__tests__/specific.test.ts`
- Deploy Trigger.dev jobs: `pnpm trigger:deploy`

## Code Structure
- **src/config**: Configuration for Redis and schedulers
- **src/lib**: Core data update implementation
- **src/trigger**: Trigger.dev job definitions
- **src/utils**: Helper functions (checksums, file download, CSV processing)

## Code Style
- TypeScript with strict type checking
- Use path aliases: `@updater/utils/module`
- Workspace imports: `@sgcarstrends/schema`, etc.
- Node.js built-ins: import from `node:*` namespace
- Function/variable naming: camelCase
- Error handling: Use try/catch for async operations
- Console.error for logging errors

## Testing
- Testing framework: Vitest
- Tests should be in `__tests__` directories next to implementation
- Test file suffix: `.test.ts`
- File mocking: `vi.mock` to mock dependencies

## Environment Setup
Required environment variables:
- DATABASE_URL: PostgreSQL connection string
- UPDATER_API_TOKEN: Authentication token
- UPSTASH_REDIS_REST_URL: Redis URL
- UPSTASH_REDIS_REST_TOKEN: Redis token