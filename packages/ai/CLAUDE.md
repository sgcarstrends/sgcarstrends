# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Access

When working with external libraries or frameworks, use the Context7 MCP tools to get up-to-date documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID for any package
2. Use `mcp__context7__get-library-docs` to retrieve comprehensive documentation and examples

This ensures you have access to the latest API documentation for dependencies like Vercel AI SDK, Google Gemini, and Langfuse used in this package.

# SG Cars Trends AI Package

## Overview

The `@sgcarstrends/ai` package provides AI-powered blog post generation for the SG Cars Trends platform. It uses Vercel AI SDK with Google Gemini to analyse car registration and COE bidding data, generating accurate, SEO-optimised blog posts with structured output validation.

**Key Features:**
- **2-Step Generation Flow**: Analysis with Code Execution Tool → Structured output with Zod validation
- **Structured Output**: Zod-validated `postSchema` ensures consistent title, excerpt, content, tags, and highlights
- **Code Execution Tool**: Allows Gemini to execute Python code for accurate data analysis and calculations
- **Hero Images**: Singapore-focused Unsplash images for contextual blog post headers
- **Tag Constants**: Predefined vocabulary for consistent categorisation (`CARS_TAGS`, `COE_TAGS`)
- **Langfuse Telemetry**: Full observability with token usage tracking, cost analysis, and performance monitoring
- **Idempotent Post Saving**: Prevents duplicate posts with conflict handling
- **Shared Logic**: Single source of truth for blog generation used by both API workflows and Admin app

## Package Structure

```
packages/ai/
├── src/
│   ├── index.ts                 # Package exports
│   ├── generate-post.ts         # Core 2-step blog generation functions
│   ├── config.ts                # System instructions and prompts (analysis + generation)
│   ├── schemas.ts               # Zod schemas for structured output (postSchema, highlightSchema)
│   ├── tags.ts                  # Tag constants and types (CARS_TAGS, COE_TAGS)
│   ├── hero-images.ts           # Hero image URLs and helpers
│   ├── queries.ts               # Database queries for data aggregation
│   ├── save-post.ts             # Post persistence with idempotency
│   └── instrumentation.ts       # Langfuse telemetry setup
└── package.json
```

## Core Functions

### `generateBlogContent(params: BlogGenerationParams)`

Standalone blog content generation function without WorkflowContext dependency. Uses a 2-step flow for accuracy and type-safety.

**Purpose**: Generate accurate, structured blog posts using Gemini with Code Execution Tool and Zod validation.

**2-Step Generation Flow:**
1. **Step 1: Code Execution** - Analyse data with Python code execution for accurate calculations
2. **Step 2: Structured Output** - Generate validated blog content matching the `postSchema`

**Parameters:**
```typescript
interface BlogGenerationParams {
  data: string;        // Pipe-delimited data (from tokeniser)
  month: string;       // Month/year (e.g., "October 2024")
  dataType: "cars" | "coe";  // Data type
}
```

**Returns:**
```typescript
interface GenerateBlogContentResult {
  object: GeneratedPost;  // Zod-validated structured output
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  response: {
    id: string;
    modelId: string;
    timestamp: Date;
  };
}

// GeneratedPost structure (from postSchema)
interface GeneratedPost {
  title: string;      // SEO title, max 100 chars
  excerpt: string;    // 2-3 sentence summary, max 500 chars
  content: string;    // Full markdown blog post (without H1 title)
  tags: string[];     // 3-5 tags in Title Case
  highlights: Array<{
    value: string;    // Metric value, e.g. "52.60%", "$125,000"
    label: string;    // Short label, e.g. "Electric Vehicles Lead"
    detail: string;   // Context, e.g. "2,081 units registered"
  }>;
}
```

**Features:**
- 2-step flow: analysis with Code Execution Tool → structured output generation
- Zod-validated output ensures consistent structure
- Extended thinking enabled for analysis step
- Langfuse telemetry for both steps
- Can be used in both workflow and non-workflow contexts

**Usage Example:**
```typescript
import { generateBlogContent, getCarsAggregatedByMonth } from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";

const cars = await getCarsAggregatedByMonth("October 2024");
const data = tokeniser(cars);

const { object, usage, response } = await generateBlogContent({
  data,
  month: "October 2024",
  dataType: "cars",
});

console.log(object.title);      // SEO-optimised title
console.log(object.excerpt);    // Meta description
console.log(object.content);    // Markdown content
console.log(object.tags);       // Category tags
console.log(object.highlights); // Key statistics for visual display
```

### `generatePost(context: WorkflowContext, params: BlogGenerationParams)`

Workflow-aware blog generation function for use in QStash workflows.

**Purpose**: Generate and save blog posts within a QStash workflow context with automatic persistence.

**Parameters:**
- `context`: QStash WorkflowContext for step orchestration
- `params`: BlogGenerationParams (same as `generateBlogContent`)

**Returns:**
```typescript
interface GenerateAndSaveResult {
  month: string;
  postId: string;
  title: string;
  slug: string;
}
```

**Features:**
- Uses `generateBlogContent()` internally (2-step flow)
- Automatically adds hero image based on dataType
- Saves structured post to database with `savePost()`
- Revalidates blog cache on web app
- Full Langfuse tracing and telemetry

**Usage Example:**
```typescript
import { serve } from "@upstash/workflow/nextjs";
import { generatePost } from "@sgcarstrends/ai";

export const POST = serve(async (context) => {
  const result = await generatePost(context, {
    data: tokenisedData,
    month: "October 2024",
    dataType: "cars",
  });

  return result;
});
```

## System Instructions

Comprehensive prompts are defined in `config.ts` with separate instructions for analysis and generation steps:

### Analysis Instructions (`ANALYSIS_INSTRUCTIONS`)

Instructions for Step 1 (Code Execution):

**Cars Analysis:**
- Data structure explanation (pipe-delimited format)
- Required calculations (totals, percentages, YoY comparisons)
- Key metrics to extract (top makes, fuel type trends, vehicle types)

**COE Analysis:**
- Bidding data structure
- Over-subscription rate calculations
- Premium movement analysis
- Category comparisons

### Generation Instructions (`GENERATION_INSTRUCTIONS`)

Instructions for Step 2 (Structured Output):

**Cars Generation:**
- Required markdown structure (without H1 title)
- Table formatting requirements (proper column headers)
- SEO optimisation guidelines (title length, keywords)
- Writing style guidelines (500-700 words, professional tone)
- Highlight selection criteria (3-6 key statistics)

**COE Generation:**
- Required sections (summary, two bidding tables)
- Premium trends and market insights
- Buyer implications
- Tag selection from predefined vocabulary

## Structured Output Schema

Zod schemas in `schemas.ts` ensure type-safe, validated output:

### `postSchema`

Main schema for blog post generation:

```typescript
const postSchema = z.object({
  title: z.string().max(100),     // SEO title, max 60 chars preferred
  excerpt: z.string().max(500),   // 2-3 sentence summary for meta description
  content: z.string(),            // Full markdown blog post (without H1 title)
  tags: z.array(z.string()).min(1).max(10),  // 3-5 tags in Title Case
  highlights: z.array(highlightSchema).min(3).max(10),  // 3-6 key statistics
});
```

### `highlightSchema`

Schema for visual key statistics display:

```typescript
const highlightSchema = z.object({
  value: z.string(),   // Metric value, e.g. "52.60%", "$125,000"
  label: z.string(),   // Short label, e.g. "Electric Vehicles Lead"
  detail: z.string(),  // Context, e.g. "2,081 units registered"
});
```

## Tag Constants

Predefined tag vocabulary in `tags.ts` for consistent categorisation:

```typescript
const CARS_TAGS = [
  "Cars", "Registrations", "Fuel Types", "Vehicle Types",
  "Monthly Update", "New Registration", "Market Trends",
] as const;

const COE_TAGS = [
  "COE", "Quota Premium", "1st Bidding Round", "2nd Bidding Round",
  "Monthly Update", "PQP",
] as const;
```

## Hero Images

Singapore-focused Unsplash images in `hero-images.ts`:

```typescript
const HERO_IMAGES = {
  cars: "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c", // Singapore highway
  coe: "https://images.unsplash.com/photo-1519045550819-021aa92e9312",  // Marina Bay Sands
};

// Get hero image URL with size parameters (1200x514)
getHeroImage(dataType: "cars" | "coe"): string
```

## Code Execution Tool

The **critical feature** in Step 1 that prevents hallucinations:

```typescript
tools: { code_execution: google.tools.codeExecution({}) }
```

**Why It Matters:**
- Allows Gemini to execute Python code to analyse data
- Performs accurate calculations (totals, percentages, aggregations)
- Verifies data formatting before generating structured output
- Eliminates guesswork and hallucinated numbers

**In 2-Step Flow:**
- Step 1 uses Code Execution Tool for accurate analysis
- Step 2 uses structured output (no Code Execution) for validated generation
- Separation ensures accuracy AND type-safety

## Langfuse Telemetry

Full observability with automatic tracing for both generation steps:

**Tracked Metrics:**
- Token usage (input, output, total) for each step
- API costs per generation
- Latency and performance per step
- Model responses and errors

**Trace Metadata (Step 1 - Analysis):**
- `functionId`: `post-analysis/cars` or `post-analysis/coe`
- `step`: "analysis"
- `month`: Data month being processed
- `dataType`: Either "cars" or "coe"
- `tags`: [dataType, month, "post-analysis"]

**Trace Metadata (Step 2 - Generation):**
- `functionId`: `post-generation/cars` or `post-generation/coe`
- `step`: "generation"
- `month`: Data month being processed
- `dataType`: Either "cars" or "coe"
- `tags`: [dataType, month, "post-generation"]

**Configuration:**
Set environment variables to enable (optional):
```bash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

## Data Queries

Helper functions in `queries.ts`:

### `getCarsAggregatedByMonth(month: string)`

Fetches and aggregates car registration data by make, fuel type, and vehicle type.

**Returns:** Array of aggregated car records with counts.

### `getCoeForMonth(month: string)`

Fetches COE bidding results for a specific month.

**Returns:** Array of COE records with bidding details.

## Post Persistence

### `savePost(params: SavePostParams)`

Saves blog post to database with idempotent conflict handling.

**Parameters:**
```typescript
interface SavePostParams {
  title: string;
  content: string;
  metadata: {
    month: string;
    dataType: string;
    responseId: string;
    modelId: string;
    timestamp: Date;
    usage: TokenUsage;
  };
}
```

**Features:**
- Pre-save check for existing posts
- `onConflictDoNothing` strategy (preserves existing posts)
- Automatic slug generation
- Cache tag revalidation

## Dependencies

**Core:**
- `@ai-sdk/google`: ^2.0.20 - Google Gemini integration
- `ai`: ^5.0.68 - Vercel AI SDK
- `@upstash/workflow`: ^0.2.12 - QStash workflow support

**Observability:**
- `@langfuse/otel`: ^4.2.0 - Langfuse OpenTelemetry integration
- `@opentelemetry/sdk-trace-node`: ^2.1.0 - Tracing SDK

**Workspace:**
- `@sgcarstrends/database`: Database schemas and queries
- `@sgcarstrends/utils`: Utility functions (tokeniser, slugify, Redis)

## Usage Patterns

### Pattern 1: Standalone Generation (Admin App)

```typescript
import { generateBlogContent, shutdownTracing, getHeroImage } from "@sgcarstrends/ai";

try {
  const { object, usage, response } = await generateBlogContent({
    data: tokenisedData,
    month: "October 2024",
    dataType: "cars",
  });

  // Access structured output fields
  console.log(object.title);      // SEO-optimised title
  console.log(object.excerpt);    // Meta description
  console.log(object.content);    // Markdown content
  console.log(object.tags);       // Category tags
  console.log(object.highlights); // Key statistics

  // Get hero image for the data type
  const heroImage = getHeroImage("cars");
} finally {
  // Shutdown tracing to flush spans
  await shutdownTracing();
}
```

### Pattern 2: Workflow Integration (API)

```typescript
import { serve } from "@upstash/workflow/nextjs";
import { generatePost } from "@sgcarstrends/ai";

export const POST = serve(async (context) => {
  const result = await generatePost(context, {
    data: tokenisedData,
    month: "October 2024",
    dataType: "cars",
  });

  // Post is automatically saved to database with:
  // - title, excerpt, content, tags, highlights from structured output
  // - Hero image automatically added based on dataType
  // Cache is revalidated
  // Tracing is shutdown

  return result;
});
```

## Code Style

- **TypeScript**: Strict mode with proper type definitions
- **Error Handling**: Try/catch blocks with console logging
- **Async/Await**: Promise-based patterns
- **Imports**: Workspace packages via `@sgcarstrends/*`

## Testing

No tests currently implemented. Future testing should cover:
- Blog content generation accuracy
- Code Execution Tool functionality
- Post persistence idempotency
- Telemetry data collection

## Environment Variables

**Required:**
- `GOOGLE_GENERATIVE_AI_API_KEY`: Google Gemini API key

**Optional (for telemetry):**
- `LANGFUSE_PUBLIC_KEY`: Langfuse public key
- `LANGFUSE_SECRET_KEY`: Langfuse secret key
- `LANGFUSE_HOST`: Langfuse host URL (defaults to https://cloud.langfuse.com)

## Related Documentation

- **API Integration**: See [apps/api/CLAUDE.md](../../apps/api/CLAUDE.md) for workflow usage
- **Admin Integration**: See [apps/admin/CLAUDE.md](../../apps/admin/CLAUDE.md) for standalone usage
- **Database Schema**: See [packages/database/CLAUDE.md](../database/CLAUDE.md) for posts table structure
