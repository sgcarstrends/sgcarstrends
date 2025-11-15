---
name: gemini-blog
description: Configure or debug LLM blog post generation using Vercel AI SDK and Google Gemini. Use when updating blog generation prompts, fixing AI integration issues, or modifying content generation logic.
allowed-tools: Read, Edit, Grep, Glob, Bash
---

# Gemini Blog Generation Skill

This skill helps you work with LLM-powered blog post generation in `apps/api/src/lib/gemini/`.

## When to Use This Skill

- Creating or updating blog post generation prompts
- Debugging AI generation failures or quality issues
- Modifying content generation workflows
- Adding new blog post types or formats
- Optimizing AI model parameters (temperature, tokens, etc.)

## Architecture

The blog generation system uses Vercel AI SDK with Google Gemini:

```
apps/api/src/lib/gemini/
├── client.ts            # Gemini AI client setup
├── prompts.ts           # Blog generation prompts
└── generate.ts          # Blog generation logic
```

## Key Patterns

### 1. AI Client Setup

```typescript
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const gemini = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

// Model selection
export const model = gemini("gemini-1.5-pro-latest");
```

### 2. Blog Generation Workflow

```typescript
import { generateText } from "ai";
import { model } from "./client";
import { createBlogPrompt } from "./prompts";

export async function generateBlogPost(data: CarData | COEData) {
  const prompt = createBlogPrompt(data);

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.7,        // Creativity level (0-1)
    maxTokens: 2000,         // Maximum response length
    topP: 0.9,               // Nucleus sampling
    frequencyPenalty: 0.5,   // Reduce repetition
  });

  return text;
}
```

### 3. Prompt Engineering

Create effective prompts with clear instructions:

```typescript
export function createBlogPrompt(data: CarData) {
  return `You are an automotive industry analyst writing for SG Cars Trends.

Context:
- Latest car registration data for ${data.month} ${data.year}
- Total registrations: ${data.total}
- Top 5 makes: ${data.topMakes.join(", ")}
- Month-over-month change: ${data.changePercent}%

Task:
Write a professional blog post (300-500 words) analyzing this data.

Requirements:
1. Start with an engaging headline
2. Provide data-driven insights
3. Explain trends and implications
4. Use Singapore context
5. End with forward-looking perspective

Tone: Professional, informative, accessible
Audience: Car buyers, industry professionals, data enthusiasts

Write the blog post now:`;
}
```

## Common Tasks

### Updating Prompts

1. Locate prompt in `apps/api/src/lib/gemini/prompts.ts`
2. Modify prompt structure or instructions
3. Test with sample data
4. Adjust based on output quality

Example prompt improvements:
- Add more specific examples
- Clarify tone and style requirements
- Include output format specifications
- Add constraints (word count, structure)

### Debugging Generation Issues

**Low Quality Output:**
1. Review prompt clarity and specificity
2. Check if data provided is complete
3. Adjust temperature (lower = more focused)
4. Increase maxTokens if output is cut off

**API Errors:**
1. Verify `GOOGLE_GEMINI_API_KEY` is set
2. Check API quota and rate limits
3. Review error messages in logs
4. Test with simpler prompts

**Inconsistent Output:**
1. Reduce temperature for more consistency
2. Add output format examples to prompt
3. Use structured output (JSON mode if needed)
4. Add validation logic

### Adding New Blog Types

1. Create new prompt template:
```typescript
export function createCOEAnalysisPrompt(coeData: COEData) {
  return `Analyze COE bidding results...`;
}
```

2. Add generation function:
```typescript
export async function generateCOEBlogPost(data: COEData) {
  const prompt = createCOEAnalysisPrompt(data);
  return await generateText({ model, prompt, ... });
}
```

3. Integrate into workflow

### Optimizing Model Parameters

**Temperature** (0-1):
- `0.0-0.3`: Factual, consistent output
- `0.4-0.7`: Balanced creativity and accuracy
- `0.8-1.0`: Highly creative, less predictable

**Top P** (0-1):
- Controls diversity of word choices
- `0.9` is a good default
- Lower values = more focused

**Frequency Penalty** (0-2):
- Reduces word repetition
- `0.5-1.0` works well for blogs
- Higher values = more varied vocabulary

## Environment Variables

Required:
- `GOOGLE_GEMINI_API_KEY` - Google AI API key

Optional:
- `GEMINI_MODEL` - Override default model (e.g., "gemini-1.5-flash")
- `GEMINI_MAX_TOKENS` - Override default max tokens

## Testing Blog Generation

Run generation tests:
```bash
pnpm -F @sgcarstrends/api test -- src/lib/gemini
```

Test manually:
```bash
# Start dev server
pnpm dev

# Trigger blog generation via API
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"type": "cars", "month": "2024-01"}'
```

## Structured Output

For consistent formatting, use structured output:

```typescript
import { generateObject } from "ai";
import { z } from "zod";

const blogSchema = z.object({
  headline: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  summary: z.string(),
});

export async function generateStructuredBlog(data: CarData) {
  const { object } = await generateObject({
    model,
    schema: blogSchema,
    prompt: createBlogPrompt(data),
  });

  return object; // Fully typed!
}
```

## Error Handling

Always handle AI generation errors:

```typescript
import { APIError } from "@ai-sdk/google";

export async function generateBlogPost(data: CarData) {
  try {
    const { text } = await generateText({
      model,
      prompt: createBlogPrompt(data),
    });

    return text;
  } catch (error) {
    if (error instanceof APIError) {
      console.error("Gemini API error:", error.message);
      // Handle quota exceeded, rate limit, etc.
    }

    throw error;
  }
}
```

## Cost Optimization

Tips for reducing API costs:

1. **Cache results**: Store generated posts in database
2. **Batch generation**: Generate multiple posts in one session
3. **Use cheaper models**: `gemini-1.5-flash` for simpler tasks
4. **Reduce max tokens**: Use appropriate limits
5. **Implement rate limiting**: Prevent accidental over-usage

## References

- Vercel AI SDK: Use Context7 for latest documentation
- Google Gemini: Use Context7 for API reference
- Related files:
  - `apps/api/src/lib/gemini/` - All blog generation code
  - `apps/api/src/routes/blog.ts` - Blog API routes
  - `apps/web/src/app/blog/` - Blog display pages
  - `apps/api/CLAUDE.md` - API service documentation

## Best Practices

1. **Prompt Clarity**: Be specific and detailed in prompts
2. **Data Validation**: Verify input data before generation
3. **Error Handling**: Handle API failures gracefully
4. **Testing**: Test with various data scenarios
5. **Monitoring**: Track generation success rate and quality
6. **Caching**: Don't regenerate identical content
7. **Review**: Implement human review for published content
8. **Versioning**: Track prompt versions for reproducibility
