# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Standards

**Language**: Always use British English spelling throughout this project (e.g., "colour" not "color", "organised" not "organized", "realise" not "realize").

## Development Commands

```bash
# Package management
pnpm install

# Code quality
pnpm run lint
pnpm run format

# Testing
pnpm test
pnpm test:ui
```

## Architecture

This package provides shared utilities for car logo management. It is a **utility package only** - the API routes have been moved to `apps/api/src/features/logos/`.

### Package Structure

**Services** (`src/services/logo/`): Core logo functionality including scraper, service, and repository patterns for logo retrieval and management.

**Types** (`src/types/`): TypeScript type definitions for CarLogo, LogoMetadata, and environment bindings.

**Utilities** (`src/utils/`): Helper functions for brand name normalisation, file handling, and logging.

**Storage** (`src/infra/storage/`): Storage abstractions for R2 and KV (Cloudflare-specific, may need adaptation for other platforms).

**Configuration** (`src/config/`): Configuration constants for paths and domains.

## Key Components

- **Logo Scraper**: Downloads logos from external sources
- **Brand Normalisation**: Converts brand names to consistent kebab-case format
- **Storage Layer**: Currently uses Cloudflare R2 + KV (requires adaptation for AWS Lambda/Vercel deployment)
- **Metadata Management**: Tracks logo files and their metadata

## Storage Implementation Note

The current storage implementation uses Cloudflare Workers R2 + KV bindings, which are **not compatible** with AWS Lambda or standard Node.js environments.

**Migration Options** (per issue #525):
1. **Vercel Blob** (recommended for simplicity)
2. **AWS S3 + DynamoDB** (if deploying to AWS Lambda)
3. **HTTP API to R2** (if deployed separately as Cloudflare Worker)

## Usage in Other Packages

This package is imported by `apps/api` for logo functionality:

```typescript
import { downloadLogo, getLogo, listLogos } from "@sgcarstrends/logos";
```

## Release Management

Releases are handled at the monorepo level. See root CLAUDE.md for commit conventions and release process.
