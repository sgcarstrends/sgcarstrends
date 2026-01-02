# Langfuse Telemetry Fix for context.call() Workflows

## Problem

After introducing `context.call()` for Gemini API requests (commit `d32ad60f`), Langfuse stopped collecting generative AI telemetry.

## Root Cause

### Before context.call() (worked)

```typescript
export const generateCarPost = async (context: WorkflowContext, month: string) => {
  return context.run("Generate blog post for cars", async () => {
    const cars = await getCarsAggregatedByMonth(month);
    const data = tokeniser(cars);
    return generateAndSavePost({ data, month, dataType: "cars" });  // No workflowContext
  });
};
```

- Entire blog generation happened inside `context.run()` block
- `context.run()` executes **synchronously** within one Lambda invocation
- Gemini API calls used standard `fetch`
- OpenTelemetry spans were created, completed, and flushed properly

### After context.call() (broken)

```typescript
export const generateCarPost = async (context: WorkflowContext, month: string) => {
  const cars = await context.run("fetch-cars-data", async () => {
    return getCarsAggregatedByMonth(month);
  });
  const data = tokeniser(cars);
  return generateBlogContent({
    data,
    month,
    dataType: "cars",
    workflowContext: context,  // Uses context.call() internally
  });
};
```

- `generateBlogContent()` uses custom fetch with `context.call()`
- `context.call()` throws `WorkflowAbort` and Lambda exits
- QStash makes HTTP call externally
- Lambda resumes in NEW invocation with response
- **OpenTelemetry spans from first invocation are LOST**

### Key Difference

| Aspect | context.run() | context.call() |
|--------|---------------|----------------|
| Execution | Synchronous within Lambda | Async via QStash |
| Lambda behavior | Runs to completion | Suspends and resumes |
| OpenTelemetry | Works (single context) | Broken (context lost) |

## Proposed Solution

Wrap Langfuse logging in `context.run()` AFTER each `generateText()` completes:

```typescript
import { startObservation } from "@langfuse/tracing";
import { startTracing, langfuseSpanProcessor } from "./instrumentation";

// After generateText() completes (workflow resumed with response)
const analysisResult = await generateText({
  model: google("gemini-3-flash-preview"),
  system: ANALYSIS_INSTRUCTIONS[dataType],
  tools: { code_execution: google.tools.codeExecution({}) },
  prompt: `Analyse this ${dataType.toUpperCase()} data for ${month}:\n${data}\n\n${ANALYSIS_PROMPTS[dataType]}`,
  providerOptions: {
    google: {
      thinkingConfig: { thinkingBudget: -1 },
    },
  },
  // NO experimental_telemetry - won't work with context.call()
});

// Log to Langfuse in a durable workflow step
await context.run("log-analysis-telemetry", async () => {
  startTracing(); // Initialize OpenTelemetry if needed

  const generation = startObservation("post-analysis", {
    model: "gemini-3-flash-preview",
    input: {
      system: ANALYSIS_INSTRUCTIONS[dataType],
      prompt: `Analyse this ${dataType.toUpperCase()} data for ${month}...`,
    },
    output: analysisResult.text,
  }, { asType: "generation" });

  generation.update({
    usageDetails: {
      input: analysisResult.usage.promptTokens,
      output: analysisResult.usage.completionTokens,
      total: analysisResult.usage.totalTokens,
    },
    metadata: {
      month,
      dataType,
      step: "analysis",
      functionId: `post-analysis/${dataType}`,
    },
  });

  generation.end();
  await langfuseSpanProcessor?.forceFlush();
});

// Repeat for Step 2 (structured output generation)
```

## Why This Works

1. **`context.run()` is synchronous** - executes in one Lambda invocation
2. **OpenTelemetry initialized fresh** - `startTracing()` sets up the tracer provider
3. **All data available** - after `generateText()` returns, we have input, output, usage, model
4. **Durable step** - workflow tracks completion, retryable if fails
5. **Immediate flush** - data sent before step ends

## Trade-offs

| Aspect | Automatic (experimental_telemetry) | Manual (this approach) |
|--------|-----------------------------------|------------------------|
| Span timing | Accurate API call duration | Not captured (external call) |
| Input/Output | Automatic capture | Manual capture |
| Token usage | Automatic | Manual |
| Metadata | Via config | Manual |
| Works with context.call() | No | Yes |

## Implementation Steps

1. Add `@langfuse/tracing` to dependencies:
   ```yaml
   # pnpm-workspace.yaml
   '@langfuse/tracing': ^4.4.2
   ```

2. Update `packages/ai/package.json`:
   ```json
   {
     "dependencies": {
       "@langfuse/tracing": "catalog:"
     }
   }
   ```

3. Create logging utility in `packages/ai/src/telemetry.ts`

4. Update `generate-post.ts`:
   - Remove `experimental_telemetry` from `generateText()` calls
   - Add `context.run()` steps for Langfuse logging after each generation

5. Test by triggering a blog generation and checking Langfuse dashboard

## References

- Upstash Workflow context.call: https://upstash.com/docs/workflow/basics/context
- Langfuse TypeScript SDK: https://langfuse.com/docs/observability/sdk/typescript/instrumentation
- Langfuse Manual Tracing: https://langfuse.com/guides/cookbook/js_langfuse_sdk
- Vercel AI SDK Telemetry: https://ai-sdk.dev/docs/ai-sdk-core/telemetry

## Status

**KIV** - Solution researched and documented, pending implementation.
