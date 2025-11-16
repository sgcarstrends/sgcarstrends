# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Access

When working with external libraries or frameworks, use the Context7 MCP tools to get up-to-date documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID for any package
2. Use `mcp__context7__get-library-docs` to retrieve comprehensive documentation and examples

This ensures you have access to the latest API documentation for dependencies like Vercel AI SDK, Google Gemini, and Langfuse used in this package.

# SG Cars Trends AI Package

## Overview

The `@sgcarstrends/ai` package provides AI-powered blog post generation for the SG Cars Trends platform. It uses Vercel AI SDK with Google Gemini to analyse car registration and COE bidding data, generating accurate, SEO-optimised blog posts with proper markdown formatting.

**Key Features:**
- **Code Execution Tool**: Allows Gemini to execute Python code for accurate data analysis and calculations
- **Comprehensive System Instructions**: 76+ lines of detailed prompts for cars and COE analysis
- **Langfuse Telemetry**: Full observability with token usage tracking, cost analysis, and performance monitoring
- **Idempotent Post Saving**: Prevents duplicate posts with conflict handling
- **Shared Logic**: Single source of truth for blog generation used by both API workflows and Admin app

## Package Structure

```
packages/ai/
├── src/
│   ├── index.ts                 # Package exports
│   ├── generate-post.ts         # Core blog generation functions
│   ├── config.ts                # System instructions and prompts
│   ├── queries.ts               # Database queries for data aggregation
│   ├── save-post.ts             # Post persistence with idempotency
│   └── instrumentation.ts       # Langfuse telemetry setup
└── package.json
```

## Core Functions

### `generateBlogContent(params: BlogGenerationParams)`

Standalone blog content generation function without WorkflowContext dependency.

**Purpose**: Generate accurate blog posts using Gemini with Code Execution Tool, telemetry, and tracing.

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
GenerateTextResult<Record<string, any>> {
  text: string;        // Generated markdown content
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  response: {
    id: string;
    modelId: string;
    timestamp: Date;
  };
}
```

**Features:**
- Always includes Code Execution Tool for accurate calculations
- Enables Langfuse telemetry for observability
- Initialises and shuts down tracing
- Can be used in both workflow and non-workflow contexts

**Usage Example:**
```typescript
import { generateBlogContent, getCarsAggregatedByMonth } from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";

const cars = await getCarsAggregatedByMonth("October 2024");
const data = tokeniser(cars);

const { text, usage, response } = await generateBlogContent({
  data,
  month: "October 2024",
  dataType: "cars",
});

console.log(text);  // Markdown blog post
```

### `generatePost(context: WorkflowContext, params: BlogGenerationParams)`

Workflow-aware blog generation function for use in QStash workflows.

**Purpose**: Generate and save blog posts within a QStash workflow context with automatic persistence.

**Parameters:**
- `context`: QStash WorkflowContext for step orchestration
- `params`: BlogGenerationParams (same as `generateBlogContent`)

**Returns:**
```typescript
interface BlogResult {
  success: boolean;
  month: string;
  postId: string;
  title: string;
  slug: string;
}
```

**Features:**
- Uses `generateBlogContent()` internally
- Saves post to database with `savePost()`
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

Comprehensive prompts are defined in `config.ts`:

**Cars Instructions (76 lines):**
- Data structure explanation (pipe-delimited format)
- Required markdown structure (title, summary, highlights, tables, analysis)
- Table formatting requirements (proper column headers, calculations)
- SEO optimisation guidelines (title length, keywords)
- Writing style guidelines (500-700 words, professional tone)

**COE Instructions (83 lines):**
- Data structure for bidding results
- Required sections (summary, highlights, two bidding tables)
- Over-subscription rate calculations
- Premium movement analysis
- Buyer implications and market insights

## Code Execution Tool

The **critical feature** that prevents hallucinations:

```typescript
tools: { code_execution: google.tools.codeExecution({}) }
```

**Why It Matters:**
- Allows Gemini to execute Python code to analyse data
- Performs accurate calculations (totals, percentages, aggregations)
- Verifies data formatting before generating markdown
- Eliminates guesswork and hallucinated numbers

**Without Code Execution Tool:**
- Gemini guesses at calculations
- Generates plausible but incorrect numbers
- Cannot verify data transformations
- Produces unreliable output

## Langfuse Telemetry

Full observability with automatic tracing:

**Tracked Metrics:**
- Token usage (prompt, completion, total)
- API costs per generation
- Latency and performance
- Model responses and errors

**Trace Metadata:**
- `functionId`: `post-generation/cars` or `post-generation/coe`
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
import { generateBlogContent, shutdownTracing } from "@sgcarstrends/ai";

try {
  const { text, usage, response } = await generateBlogContent({
    data: tokenisedData,
    month: "October 2024",
    dataType: "cars",
  });

  // Use text to save to database or display
  console.log(text);
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

  // Post is automatically saved to database
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
