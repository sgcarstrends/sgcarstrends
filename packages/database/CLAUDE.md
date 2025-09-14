# CLAUDE.md - Database Package

This file provides guidance to Claude Code (claude.ai/code) when working with the database package in this repository.

## Documentation Access

When working with Drizzle ORM, use the Context7 MCP tools to get up-to-date documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID for Drizzle
2. Use `mcp__context7__get-library-docs` to retrieve comprehensive documentation and examples

This ensures you have access to the latest API documentation for Drizzle ORM features and patterns.

# SG Cars Trends Database - Developer Reference Guide

## Package Overview

The `@sgcarstrends/database` package (v4.11.0) provides the database schema, types, and migration system for the SG Cars Trends
platform. It uses Drizzle ORM v0.44.3 with PostgreSQL to manage:
 
- **Car Registration Data**: Monthly vehicle registration statistics by make, fuel type, and vehicle type
- **COE Bidding Results**: Certificate of Entitlement bidding data and Prevailing Quota Premium rates
- **Blog Posts**: LLM-generated blog content with metadata and SEO information
- **Analytics**: Page views and visitor tracking data

## Commands

### Schema Management

- **Generate migrations**: `pnpm generate` (creates migration files from schema changes using drizzle-kit)
- **Run migrations**: `pnpm migrate` (applies pending migrations to database using drizzle-kit)
- **Check migrations**: `pnpm migrate:check` (validates migration consistency using drizzle-kit)
- **Push schema**: `pnpm push` (push schema changes directly to database)
- **Drop database**: `pnpm drop` (drop database objects)

### Development Workflow

```bash
# 1. Modify schema files in src/schema/
# 2. Generate migration
pnpm generate

# 3. Review generated migration in migrations/
# 4. Apply migration to database
pnpm migrate

# 5. Verify schema consistency
pnpm migrate:check
```

## File Structure

```
src/
├── schema/
│   ├── index.ts         # Main schema exports
│   ├── cars.ts          # Car registration table schema
│   ├── coe.ts           # COE bidding tables (coe, coePQP)
│   ├── posts.ts         # Blog posts table schema
│   └── analytics.ts     # Analytics tracking table schema
├── client.ts            # Drizzle client setup
├── index.ts             # Package entry point (re-exports schema & client)
├── drizzle.config.ts    # Drizzle configuration
└── migrations/          # Generated migration files
```

## Database Schema

### Cars Table (`cars`)

Stores monthly vehicle registration data from LTA DataMall.

**Columns:**

- `id`: UUID primary key (auto-generated)
- `month`: Text (YYYY-MM format, e.g., "2024-01")
- `make`: Text (vehicle manufacturer, e.g., "Toyota", "BMW")
- `importer_type`: Text (registration type)
- `fuel_type`: Text ("Petrol", "Diesel", "Electric", "Hybrid")
- `vehicle_type`: Text ("Cars", "Motor cycles", "Buses", etc.)
- `number`: Integer (number of registrations)

**Indexes:**

- `month_make_idx`: Compound index for month + make queries
- `month_idx`: Month-based filtering
- `make_idx`: Make-based filtering
- `fuel_type_idx`: Fuel type analysis
- `make_fuel_type_idx`: Compound index for make + fuel type
- `number_idx`: Registration volume sorting

### COE Tables

#### COE Bidding Results (`coe`)

Stores Certificate of Entitlement bidding exercise results.

**Columns:**

- `id`: UUID primary key
- `month`: Text (bidding month)
- `bidding_no`: Integer (exercise number, 1 or 2)
- `vehicle_class`: Text (COE category)
- `quota`: Integer (available certificates)
- `bids_received`: Integer (total bids submitted)
- `premium`: Numeric (winning premium in SGD)

#### COE Prevailing Quota Premium (`coePQP`)

Stores monthly PQP rates for immediate vehicle registration.

**Columns:**

- `id`: UUID primary key
- `month`: Text (month)
- `vehicle_class`: Text (COE category)
- `premium`: Numeric (PQP rate in SGD)

### Blog Posts (`posts`)

Stores LLM-generated blog content with comprehensive metadata.

**Columns:**

- `id`: UUID primary key
- `title`: Text (blog post title)
- `slug`: Text (URL-friendly identifier, unique)
- `content`: Text (Markdown content)
- `excerpt`: Text (short summary)
- `published_at`: Timestamp (publication date)
- `created_at`: Timestamp (creation date)
- `updated_at`: Timestamp (last modification)
- `tags`: Text array (content categorization)
- `reading_time`: Integer (estimated minutes)
- `view_count`: Integer (reader analytics)
- `llm_model`: Text (AI model used for generation)
- `data_month`: Text (source data month)
- `data_type`: Text ("cars" or "coe")

**Indexes:**

- `slug_idx`: Unique index for URL routing
- `published_at_idx`: Chronological sorting
- `tags_idx`: Tag-based filtering
- `data_month_idx`: Data period filtering

### Analytics (`analyticsTable`)

Tracks page views and visitor metrics for performance monitoring.

**Columns:**

- `id`: UUID primary key
- `pathname`: Text (page URL path)
- `views`: Integer (view count)
- `visitors`: Integer (unique visitor count)
- `updated_at`: Timestamp (last update)

**Indexes:**

- `pathname_idx`: Path-based lookups
- `updated_at_idx`: Temporal sorting

## TypeScript Integration

### Type Exports

Each schema file exports corresponding TypeScript types:

```typescript
// Insert types (for creating new records)
export type InsertCar = typeof cars.$inferInsert;
export type InsertCOE = typeof coe.$inferInsert;
export type InsertPost = typeof posts.$inferInsert;

// Select types (for query results)
export type SelectCar = typeof cars.$inferSelect;
export type SelectCOE = typeof coe.$inferSelect;
export type SelectPost = typeof posts.$inferSelect;
```

### Usage in Applications

```typescript
import {cars, type SelectCar} from "@sgcarstrends/database";
import {db} from "./config/db";

// Type-safe database queries
const carData: SelectCar[] = await db.select().from(cars);
```

## Migration Strategy

### Schema Changes

1. **Modify schema files** in `src/schema/` with new tables or columns
2. **Generate migration** using `pnpm generate` to create SQL migration files
3. **Review migration** in `migrations/` directory for correctness
4. **Apply migration** with `pnpm migrate` to update database schema
5. **Update types** automatically inferred from schema changes

### Migration Files

- Located in `migrations/` directory
- Named with timestamp prefix for ordering
- Include both up and down migration SQL
- Tracked in `meta/_journal.json` for consistency

## Development Guidelines

### Schema Design Patterns

- Use `uuid().defaultRandom().primaryKey()` for all primary keys
- Add strategic indexes for common query patterns
- Use appropriate column types (text, integer, numeric, timestamp)
- Include created_at/updated_at timestamps for audit trails

### Type Safety

- Always export `Insert` and `Select` types from schema files
- Use Drizzle's type inference (`$inferInsert`, `$inferSelect`)
- Leverage TypeScript strict mode for compile-time validation
- Import types from this package in consuming applications

### Performance Optimization

- Create compound indexes for multi-column queries
- Index foreign key columns for join performance
- Consider partial indexes for filtered queries
- Monitor query performance and add indexes as needed

## Environment Configuration

### Database Connection

The package uses `DATABASE_URL` environment variable for PostgreSQL connection:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Drizzle Configuration

Configuration in `drizzle.config.ts` using drizzle-kit v0.31.4:

- **Schema**: Points to `./src/schema/index.ts`
- **Output**: Migrations stored in `./migrations`
- **Dialect**: PostgreSQL
- **Driver**: Neon Serverless v1.0.1
- **Credentials**: Uses `DATABASE_URL` environment variable

## Integration with Applications

### Database Connection

Applications should create their own database connection using this schema:

```typescript
import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@sgcarstrends/database";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, {schema});
```

### Query Patterns

Common query patterns for each table:

```typescript
// Cars: Monthly registration data
await db.select().from(cars).where(eq(cars.month, "2024-01"));

// COE: Latest bidding results  
await db.select().from(coe).orderBy(desc(coe.month));

// Posts: Published blog content
await db.select().from(posts).where(isNotNull(posts.published_at));
```

## Best Practices

### Schema Evolution

- Always generate migrations for schema changes
- Test migrations on development data before production
- Keep migration files in version control
- Document breaking changes in schema evolution

### Type Management

- Re-export types from package index for clean imports
- Use descriptive type names that match table purposes
- Maintain type consistency across the monorepo
- Leverage Drizzle's automatic type inference

### Performance

- Add indexes based on actual query patterns
- Monitor slow queries and optimize schema accordingly
- Use appropriate data types for storage efficiency
- Consider partitioning for large historical datasets
