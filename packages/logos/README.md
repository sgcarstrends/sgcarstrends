# Car Logos API

A Cloudflare Worker API that serves car brand logos. Built with TypeScript, Hono, and Cloudflare R2 storage.

## Features

- **REST API**: Simple endpoints for listing and retrieving car brand logos
- **Auto-scraping**: Missing logos are automatically scraped and cached on first request
- **R2 Storage**: All logos stored in Cloudflare R2 with manifest tracking
- **Brand Normalization**: Consistent kebab-case naming for reliable storage
- **Fast Lookups**: JSON manifest enables quick logo availability checks

## API Endpoints

### GET `/`

Returns API information and available endpoints.

### GET `/api/logos`

Lists all cached logos with metadata.

**Response:**

```json
{
  "success": true,
  "count": 42,
  "logos": [
    {
      "brand": "toyota",
      "url": "https://your-r2-bucket.com/toyota.png",
      "lastModified": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/logo/:brand`

Gets a specific brand's logo URL. If not cached, automatically scrapes and stores it.

**Parameters:**

- `brand` (string): Car brand name (case-insensitive)

**Response:**

```json
{
  "success": true,
  "logo": {
    "brand": "toyota",
    "url": "https://your-r2-bucket.com/toyota.png",
    "lastModified": "2024-01-01T00:00:00.000Z"
  }
}
```

## Environment Setup

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- Cloudflare account with R2 storage
- Wrangler CLI

### Installation

```bash
# Install dependencies
pnpm install

# Configure Cloudflare R2 bucket
# Update wrangler.toml with your R2 bucket details
```

### Environment Variables

The application requires a Cloudflare R2 bucket binding named `CAR_LOGOS` as configured in `wrangler.toml`.

## Development Commands

```bash
# Start local development server
pnpm run dev
# or
wrangler dev

# Code quality
pnpm run lint          # Check code style
pnpm run format        # Auto-format code

# Deployment
pnpm run deploy        # Deploy to Cloudflare Workers
# or
wrangler deploy

# Release management
pnpm run release       # Create release
pnpm run release:dry   # Dry run release
```

## Architecture

This Cloudflare Worker follows a simple service-oriented architecture:

- **API Layer** (`src/index.ts`): Hono-based REST API with CORS support
- **Logo Service** (`src/services/download.ts`): Handles logo retrieval, R2 storage, and manifest management
- **Brand Normalization** (`src/utils/index.ts`): Converts brand names to kebab-case filenames
- **R2 Storage**: Stores logo images and `manifest.json` for fast lookups
- **Web Scraping**: Uses Cheerio to parse logo sources