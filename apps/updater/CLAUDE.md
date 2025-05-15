# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Build: `pnpm build`
- Develop: `pnpm dev` (starts SST dev environment)
- Lint: `pnpm lint` (uses Biome)
- Test all: `pnpm test`
- Test watch: `pnpm test:watch`
- Test coverage: `pnpm test:coverage`
- Run single test: `pnpm test -- src/utils/__tests__/specific.test.ts`
- Deploy: `pnpm deploy`
- Deploy to specific stage: `pnpm deploy --stage <stage-name>`

## Code Style

- TypeScript with strict type checking
- Use double quotes for strings (Biome enforced)
- Use spaces for indentation (Biome enforced)
- Organize imports automatically (Biome enforced)
- Use path aliases: `@updater/utils/module`
- Workspace imports: `@sgcarstrends/schema`, etc.
- Node.js built-ins: import from `node:*` namespace
- Function/variable naming: camelCase
- Error handling: Use try/catch for async operations with console.error for logging

## Testing

- Vitest for testing with tests in `__tests__` directories
- Test file suffix: `.test.ts`
- File mocking: `vi.mock` for dependencies

## Workflow Architecture

The updater service uses a workflow-based architecture with two main workflows:

1. **Cars Workflow** (`src/lib/workflows/cars.ts`)
   - Downloads and processes car registration data
   - Updates database with new records
   - Publishes to social media platforms when new data is available

2. **COE Workflow** (`src/lib/workflows/coe.ts`)
   - Handles COE bidding results and PQP rates
   - Processes multiple tasks (COE bidding results and PQP) within a single workflow
   - Publishes updates to social media platforms when new data is available

### Key Components

- **Task Processing** (`src/lib/workflow.ts`): Handles individual data update tasks with common processing logic and Redis-based timestamp tracking
- **Updater** (`src/lib/updater.ts`): Core logic for file download, checksum verification, CSV processing, and database updates
- **Platforms** (`src/config/platforms.ts`): Configures social media platforms for publishing updates (Discord, LinkedIn, Telegram, Twitter)
- **QStash Integration** (`src/config/qstash.ts`): Provides message queue functionality for workflow execution

### Workflow Flow

1. Workflows are triggered via HTTP endpoints
2. Each workflow processes its relevant tasks independently
3. Files are downloaded and checksums verified to prevent redundant processing
4. New data is inserted into the database in batches
5. If records are processed, updates are published to configured social media platforms
6. Error handling includes Discord notifications for workflow failures

### Design Principles

- Keep workflows modular and independent
- Use checksums to avoid redundant processing
- Batch database operations for efficiency
- Conditionally publish to social media based on environment and data changes
- Provide comprehensive error handling and notifications