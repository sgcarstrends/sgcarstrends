# @sgcarstrends/ai

AI-powered blog post generation for the SG Cars Trends platform using Vercel AI SDK with Google Gemini.

## Features

- 🤖 **AI-Powered Analysis**: Automated blog post generation using Google Gemini 2.5 Flash
- 🧮 **Code Execution Tool**: Accurate data calculations and transformations via Python execution
- 📊 **Data-Driven Insights**: Comprehensive analysis of car registration and COE bidding trends
- 📝 **SEO-Optimised Content**: Markdown-formatted posts with proper structure and keywords
- 📈 **Observability**: Full Langfuse telemetry for token usage, costs, and performance tracking
- ♻️ **Idempotent Persistence**: Prevents duplicate posts with conflict handling
- 🔄 **Reusable Logic**: Single source of truth shared across API workflows and Admin app

## Installation

This package is part of the SG Cars Trends monorepo and uses workspace dependencies:

```bash
pnpm add @sgcarstrends/ai
```

## Usage

### Standalone Blog Generation

Generate blog content without workflow context (e.g., in Admin app):

```typescript
import { generateBlogContent, shutdownTracing } from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";

try {
  // Fetch and tokenise data
  const cars = await getCarsAggregatedByMonth("October 2024");
  const data = tokeniser(cars);

  // Generate blog content
  const { object, usage, response } = await generateBlogContent({
    data,
    month: "October 2024",
    dataType: "cars",
  });

  console.log(object.title);      // SEO-optimised title
  console.log(object.excerpt);    // Meta description
  console.log(object.content);    // Markdown content
  console.log(object.tags);       // Category tags
  console.log(object.highlights); // Key statistics
  console.log(usage);             // Token usage statistics
} finally {
  // Flush telemetry spans
  await shutdownTracing();
}
```

### Workflow Integration

Generate and save blog posts within QStash workflows:

```typescript
import { serve } from "@upstash/workflow/nextjs";
import { generatePost } from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";

export const POST = serve(async (context) => {
  // Fetch and tokenise data
  const cars = await getCarsAggregatedByMonth("October 2024");
  const data = tokeniser(cars);

  // Generate and save blog post
  const result = await generatePost(context, {
    data,
    month: "October 2024",
    dataType: "cars",
  });

  return result; // { success, month, postId, title, slug }
});
```

## API Reference

### `generateBlogContent(params: BlogGenerationParams)`

Generate blog content using Google Gemini with Code Execution Tool.

**Parameters:**

```typescript
interface BlogGenerationParams {
  data: string; // Pipe-delimited data from tokeniser
  month: string; // Month/year (e.g., "October 2024")
  dataType: "cars" | "coe"; // Data type
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

### `generatePost(context: WorkflowContext, params: BlogGenerationParams)`

Generate and save blog post within a QStash workflow.

**Parameters:**

- `context`: QStash WorkflowContext
- `params`: BlogGenerationParams (same as above)

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

### Helper Functions

```typescript
// Fetch aggregated car registration data
getCarsAggregatedByMonth(month: string): Promise<CarRecord[]>

// Fetch COE bidding results
getCoeForMonth(month: string): Promise<CoeRecord[]>

// Save blog post to database
savePost(params: SavePostParams): Promise<Post>

// Initialise Langfuse tracing
startTracing(): void

// Shutdown tracing and flush spans
shutdownTracing(): Promise<void>
```

## Environment Variables

**Required:**

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

**Optional (for telemetry):**

```bash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

## How It Works

### 2-Step Generation Flow

The package uses a two-step approach for accuracy and type-safety:

**Step 1: Analysis with Code Execution Tool**
```typescript
tools: { code_execution: google.tools.codeExecution({}) }
```

Allows Gemini to execute Python code for:
- ✅ Accurate data analysis and calculations
- ✅ Proper table generation with verified numbers
- ✅ No hallucinated statistics
- ✅ Reliable percentage calculations

**Step 2: Structured Output Generation**
```typescript
output: schema(postSchema)
```

Generates Zod-validated structured output ensuring:
- ✅ Consistent title, excerpt, content, tags, highlights format
- ✅ Type-safe response matching `postSchema`
- ✅ Validated field constraints (title max 100 chars, 3-10 highlights, etc.)

**Why Two Steps:**
- Separation ensures both accuracy (Step 1) AND type-safety (Step 2)
- Code Execution Tool prevents hallucinations in analysis
- Structured output ensures consistent, validated format

### System Instructions

Comprehensive prompts ensure high-quality output:

**Cars Analysis (76 lines):**

- Data structure explanation
- Required markdown sections
- Table formatting rules
- SEO optimisation guidelines
- Writing style requirements

**COE Analysis (83 lines):**

- Bidding data structure
- Two bidding exercise tables
- Over-subscription calculations
- Premium movement analysis
- Buyer implications

### Langfuse Telemetry

Automatic observability tracking:

- Token usage (prompt, completion, total)
- API costs per generation
- Latency and performance metrics
- Model responses and errors

View traces at [cloud.langfuse.com](https://cloud.langfuse.com)

## Dependencies

- `@ai-sdk/google` - Google Gemini integration
- `ai` - Vercel AI SDK
- `@upstash/workflow` - QStash workflow support
- `@langfuse/otel` - Langfuse telemetry
- `@sgcarstrends/database` - Database schemas
- `@sgcarstrends/utils` - Utility functions

## License

MIT
