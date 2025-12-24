import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import type { HTTPMethods } from "@upstash/qstash";
import { WorkflowAbort, type WorkflowContext } from "@upstash/workflow";
import { generateText, type LanguageModelUsage, Output, stepCountIs } from "ai";
import { type BlogGenerationParams, INSTRUCTIONS, PROMPTS } from "./config";
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
 * Result of blog content generation
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
 * Uses a single call with both code execution (tools) and structured output for accuracy and type-safety.
 */
async function generateContent(
  options: BlogGenerationOptions,
): Promise<GenerateBlogContentResult> {
  const { data, month, dataType, workflowContext } = options;

  // Create workflow-aware Google provider that uses context.call()
  const google = createWorkflowGoogle(workflowContext);

  console.log(`[GENERATE] ${dataType} blog generation started...`);

  // Initialise LangFuse tracing
  startTracing();

  try {
    const result = await generateText({
      model: google("gemini-3-flash-preview"),
      tools: { code_execution: google.tools.codeExecution({}) },
      output: Output.object({
        schema: postSchema,
      }),
      stopWhen: stepCountIs(10),
      system: INSTRUCTIONS[dataType],
      prompt: `Generate a blog post for ${dataType.toUpperCase()} data from ${month}:\n\n${data}\n\n${PROMPTS[dataType]}`,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingLevel: "medium",
            includeThoughts: true,
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: `post-generation/${dataType}`,
        metadata: {
          month,
          dataType,
          tags: [dataType, month, "post-generation"],
        },
      },
    });

    console.log(`[GENERATE] ${dataType} blog generation completed`);
    console.log(`[GENERATE] Steps: ${result.steps?.length ?? 0}`);
    console.log(`[GENERATE] Finish reason: ${result.finishReason}`);
    console.log(`[GENERATE] Tool calls: ${result.toolCalls?.length ?? 0}`);

    const { output, usage, response } = result;

    return {
      output,
      usage,
      response: {
        id: response.id,
        modelId: response.modelId,
        timestamp: response.timestamp,
      },
    };
  } catch (error) {
    if (error.cause instanceof WorkflowAbort) {
      throw error.cause;
    }
    throw error;
  }
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
 * Get bypass headers for Vercel Deployment Protection (preview environments only)
 */
function getBypassHeaders(): Record<string, string> | undefined {
  const isProduction = process.env.VERCEL_ENV === "production";
  if (isProduction || !process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    return undefined;
  }
  return {
    "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  };
}

/**
 * Creates a workflow-aware Google Generative AI provider that uses context.call()
 * for HTTP requests. This allows the Lambda to exit while QStash handles the request.
 */
function createWorkflowGoogle(context: WorkflowContext) {
  return createGoogleGenerativeAI({
    fetch: async (input, init) => {
      try {
        const headers = init?.headers
          ? Object.fromEntries(new Headers(init.headers).entries())
          : {};

        const body = init?.body ? JSON.parse(init.body as string) : undefined;

        const responseInfo = await context.call(`Gemini`, {
          url: input.toString(),
          method: (init?.method as HTTPMethods) ?? "POST",
          headers: { ...headers, ...getBypassHeaders() },
          body,
        });

        const responseHeaders = new Headers(
          Object.entries(responseInfo.header).reduce(
            (acc, [key, values]) => {
              acc[key] = values.join(", ");
              return acc;
            },
            {} as Record<string, string>,
          ),
        );

        return new Response(JSON.stringify(responseInfo.body), {
          status: responseInfo.status,
          headers: responseHeaders,
        });
      } catch (error) {
        if (error instanceof WorkflowAbort) {
          throw error;
        }
        console.error("Error in fetch implementation:", error);
        throw error;
      }
    },
  });
}
