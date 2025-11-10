# @sgcarstrends/logos

Shared utilities for car logo management in the SG Cars Trends monorepo.

## Overview

This package provides core utilities for scraping, storing, and retrieving car brand logos. It is a **utility package only** - the API routes are implemented in `apps/api/src/features/logos/`.

## Features

- **Logo Scraper**: Automatically downloads car brand logos from external sources
- **Brand Normalisation**: Consistent kebab-case naming for storage keys
- **Storage Abstractions**: Repository pattern for R2 and KV storage
- **Metadata Management**: Tracks logo files and their metadata
- **Type Safety**: Full TypeScript support with exported types

## Installation

This package is part of the monorepo workspace. It's automatically linked when you run:

```bash
pnpm install
```

## Usage

Import utilities in other workspace packages:

```typescript
import { downloadLogo, getLogo, listLogos } from "@sgcarstrends/logos";
import { normaliseBrandName } from "@sgcarstrends/logos";
import type { CarLogo, LogoMetadata } from "@sgcarstrends/logos";
```

### Example: Download a Logo

```typescript
import { downloadLogo } from "@sgcarstrends/logos";

// Download and store a logo
const result = await downloadLogo(r2Bucket, kvStore, "Toyota");

if (result.success) {
  console.log(`Logo URL: ${result.logo.url}`);
} else {
  console.error(`Error: ${result.error}`);
}
```

### Example: Retrieve a Logo

```typescript
import { getLogo } from "@sgcarstrends/logos";

// Get logo from storage
const logo = await getLogo(r2Bucket, kvStore, "Toyota");

if (logo) {
  console.log(`Brand: ${logo.brand}`);
  console.log(`URL: ${logo.url}`);
}
```

### Example: Normalise Brand Name

```typescript
import { normaliseBrandName } from "@sgcarstrends/logos";

const normalised = normaliseBrandName("Mercedes-Benz");
// Result: "mercedes-benz"
```

## Package Structure

```
packages/logos/
├── src/
│   ├── services/logo/     # Core logo functionality
│   │   ├── scraper.ts     # Logo download logic
│   │   ├── service.ts     # Logo service layer
│   │   └── repository.ts  # Data access layer
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── normalisation.ts
│   │   ├── file-utils.ts
│   │   └── logger.ts
│   ├── infra/storage/     # Storage abstractions (R2, KV)
│   ├── config/            # Configuration constants
│   └── index.ts           # Public API exports
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Storage Implementation Note

The current storage implementation uses **Cloudflare Workers R2 + KV bindings**, which are not compatible with AWS Lambda or standard Node.js environments.

### Migration Options (per issue #525)

1. **Vercel Blob** (recommended for simplicity)
2. **AWS S3 + DynamoDB** (for AWS Lambda deployment)
3. **HTTP API to R2** (if deployed separately as Cloudflare Worker)

## Development Commands

```bash
# Code quality
pnpm lint          # Check code style with Biome
pnpm format        # Auto-format code with Biome

# Testing
pnpm test          # Run tests
pnpm test:ui       # Run tests with UI
pnpm test:run      # Run tests once
```

## API Integration

The API routes are implemented in `apps/api/src/features/logos/` and mounted at `/logos`:

- `GET /logos` - List all cached logos
- `GET /logos/:brand` - Get specific brand logo (auto-download if missing)

## Types

### CarLogo

```typescript
interface CarLogo {
  brand: string;
  url: string;
  filename: string;
}
```

### LogoMetadata

```typescript
interface LogoMetadata {
  brand: string;
  filename: string;
  url: string;
  createdAt: string;
  fileSize?: number;
}
```

## Contributing

This package follows the monorepo conventions. See root `CLAUDE.md` for:
- Commit message format
- Code style guidelines
- Testing requirements
- Release process

## License

MIT
