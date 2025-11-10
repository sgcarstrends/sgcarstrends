# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Standards

**Language**: Always use British English spelling throughout this project (e.g., "colour" not "color", "organised" not "organized", "realise" not "realize").

## Development Commands

```bash
# Package management
pnpm install

# Local development server
pnpm run dev
# or directly
wrangler dev

# Deploy to Cloudflare Workers
pnpm run deploy
# or directly
wrangler deploy

# Code quality
pnpm run lint
pnpm run format
# or directly
biome lint src
biome format src --write

# Release management
pnpm run release
pnpm run release:dry
# or directly
semantic-release
semantic-release --dry-run
```

## Architecture

This is a Cloudflare Worker API that scrapes and serves car brand logos. The application follows a simple service-orientated architecture:

**API Layer** (`src/index.ts`): Hono-based REST API with endpoints for listing all logos and retrieving specific brand logos.

**Logo Service** (`src/services/download.ts`): Handles logo scraping, R2 storage operations, and manifest management. Uses Cheerio for HTML parsing and maintains a JSON manifest of stored logos.

**Brand Normalization** (`src/utils/index.ts`): Converts brand names to consistent kebab-case filenames for storage.

## Key Components

- **R2 Storage**: Cloudflare R2 bucket stores logo images and `manifest.json` metadata
- **Web Scraping**: Scrapes logo sources to find new logo URLs when requested
- **Manifest System**: Tracks all stored logos in `manifest.json` for fast lookups
- **Auto-Download**: Missing logos are automatically scraped and cached on first request

## Environment

Requires Cloudflare R2 bucket binding named `CAR_LOGOS` as configured in `wrangler.toml`.

## Commit Convention

Uses conventional commits for automated releases. Commits must follow the format: `type(scope): description`