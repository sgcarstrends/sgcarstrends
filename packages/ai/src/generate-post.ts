import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { HTTPMethods } from "@upstash/qstash";
import { WorkflowAbort, type WorkflowContext } from "@upstash/workflow";
import { generateText, type LanguageModelUsage, Output } from "ai";
import {
  ANALYSIS_INSTRUCTIONS,
  ANALYSIS_PROMPTS,
  type BlogGenerationParams,
  GENERATION_INSTRUCTIONS,
  GENERATION_PROMPTS,
} from "./config";
import { getHeroImage } from "./hero-images";
import { shutdownTracing, startTracing } from "./instrumentation";
import { savePost } from "./save-post";
import { type GeneratedPost, postSchema } from "./schemas";

/**
 * Result of generating and saving a blog post
 */
export interface GenerateAndSaveResult {
  month: string;
  postId: string;
  title: string;
  slug: string;
}

/**
 * Result of the 2-step blog content generation
 */
export interface GenerateBlogContentResult {
  output: GeneratedPost;
  usage: LanguageModelUsage;
  response: {
    id: string;
    modelId: string;
    timestamp: Date;
  };
}

/**
 * Blog generation options including workflow context for context.call() usage
 */
export interface BlogGenerationOptions extends BlogGenerationParams {
  workflowContext: WorkflowContext;
}

/**
 * Internal: AI content generation using context.call() for reduced Lambda billing.
 * Uses a 2-step flow for accuracy and type-safety:
 *
 * Step 1: Code Execution - Analyse data with Python code execution for accurate calculations
 * Step 2: Structured Output - Generate validated blog content matching the postSchema
 */
async function generateContent(
  options: BlogGenerationOptions,
): Promise<GenerateBlogContentResult> {
  const { data, month, dataType, workflowContext } = options;

  // Create workflow-aware Google provider that uses context.call()
  const google = createWorkflowGoogle(workflowContext);

  // Initialize LangFuse tracing
  startTracing();

  console.log(`[STEP 1] ${dataType} data analysis started...`);

  // STEP 1: Code Execution for accurate analysis
  const analysisResult = await generateText({
    model: google("gemini-3-flash-preview"),
    system: ANALYSIS_INSTRUCTIONS[dataType],
    tools: { code_execution: google.tools.codeExecution({}) },
    prompt: `Analyse this ${dataType.toUpperCase()} data for ${month}:\n${data}\n\n${ANALYSIS_PROMPTS[dataType]}`,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: -1,
        },
      },
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: `post-analysis/${dataType}`,
      metadata: {
        month,
        dataType,
        step: "analysis",
        tags: [dataType, month, "post-analysis"],
      },
    },
  });

  console.log(`[STEP 1] ${dataType} data analysis completed`);
  console.log(`[STEP 2] ${dataType} structured output generation started...`);

  // STEP 2: Structured Output generation (no extended thinking - faster)
  const { output, usage, response } = await generateText({
    model: google("gemini-3-flash-preview"),
    output: Output.object({
      schema: postSchema,
    }),
    system: GENERATION_INSTRUCTIONS[dataType],
    prompt: `Based on this analysis:\n\n${analysisResult.text}\n\nOriginal data for ${month}:\n${data}\n\n${GENERATION_PROMPTS[dataType]}`,
    experimental_telemetry: {
      isEnabled: true,
      functionId: `post-generation/${dataType}`,
      metadata: {
        month,
        dataType,
        step: "structured-output",
        tags: [dataType, month, "post-generation"],
      },
    },
  });

  console.log(`[STEP 2] ${dataType} structured output generation completed`);

  return {
    output,
    usage,
    response: {
      id: response.id,
      modelId: response.modelId,
      timestamp: response.timestamp,
    },
  };
}

async function saveGeneratedPost(
  options: BlogGenerationOptions,
): Promise<GenerateAndSaveResult> {
  const { month, dataType } = options;

  const { output, usage, response } = await generateContent(options);

  console.log(`${dataType} blog post generated, saving to database...`);

  const heroImage = getHeroImage(dataType);

  const post = await savePost({
    title: output.title,
    content: output.content,
    excerpt: output.excerpt,
    tags: output.tags,
    highlights: output.highlights,
    heroImage,
    month,
    dataType,
    responseMetadata: {
      responseId: response.id,
      modelId: response.modelId,
      timestamp: response.timestamp,
      usage,
    },
  });

  console.log(`${dataType} blog post saved successfully`);

  // Shutdown tracing only after successful completion
  await shutdownTracing();

  return {
    month,
    postId: post.id,
    title: post.title,
    slug: post.slug,
  };
}

/**
 * Generates and saves a new blog post using context.call() for reduced Lambda billing.
 * Used by API workflow for creating new posts.
 */
export async function generateBlogContent(
  options: BlogGenerationOptions,
): Promise<GenerateAndSaveResult> {
  return saveGeneratedPost(options);
}

/**
 * Regenerates and updates an existing blog post using context.call() for reduced Lambda billing.
 * Used by Admin for updating existing posts.
 */
export async function regenerateBlogContent(
  options: BlogGenerationOptions,
): Promise<GenerateAndSaveResult> {
  return saveGeneratedPost(options);
}

/**
 * Creates a workflow-aware Google Generative AI provider that uses context.call()
 * for HTTP requests. This allows the Lambda to exit while QStash handles the request.
 */
function createWorkflowGoogle(context: WorkflowContext) {
  let stepCounter = 0;

  return createGoogleGenerativeAI({
    fetch: async (input, init) => {
      try {
        const requestHeaders: Record<string, string> = {};
        if (init?.headers) {
          new Headers(init.headers).forEach((value, key) => {
            requestHeaders[key] = value;
          });
        }
        const body = init?.body ? JSON.parse(init.body as string) : undefined;

        const response = await context.call(`gemini-${++stepCounter}`, {
          url: input.toString(),
          method: (init?.method as HTTPMethods) ?? "POST",
          headers: requestHeaders,
          body,
          timeout: "120s",
        });

        // Flatten response headers (string[] -> string)
        const responseHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(response.header)) {
          responseHeaders[key] = Array.isArray(value)
            ? value.join(", ")
            : value;
        }

        return new Response(JSON.stringify(response.body), {
          status: response.status,
          headers: new Headers(responseHeaders),
        });
      } catch (error) {
        if (error instanceof WorkflowAbort) {
          // Re-throw without logging - this is expected control flow, not an error
          throw error;
        }
        // Only actual errors get logged
        console.error("Gemini API error:", error);
        throw error;
      }
    },
  });
}
