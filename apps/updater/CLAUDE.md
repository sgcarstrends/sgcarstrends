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