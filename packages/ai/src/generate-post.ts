import { google } from "@ai-sdk/google";
import type { WorkflowContext } from "@upstash/workflow";
import { generateText } from "ai";
import {
  type BlogGenerationParams,
  type BlogResult,
  GENERATION_PROMPTS,
  SYSTEM_INSTRUCTIONS,
} from "./config";
import { shutdownTracing, startTracing } from "./instrumentation";
import { savePost } from "./save-post";

/**
 * Result of generating and saving a blog post
 */
export interface GenerateAndSaveResult {
  success: boolean;
  month: string;
  postId: string;
  title: string;
  slug: string;
}

/**
 * Standalone blog content generation function without WorkflowContext dependency.
 * Can be used in both workflow and non-workflow contexts (e.g., Admin app).
 * Always includes Code Execution Tool, telemetry, and tracing for accuracy and observability.
 *
 * @param params - Blog generation parameters (data, month, dataType)
 * @returns Generated text, usage stats, and response metadata
 */
export const generateBlogContent = async (params: BlogGenerationParams) => {
  const { data, month, dataType } = params;

  // Initialize LangFuse tracing
  startTracing();

  console.log(`${dataType} blog post generation started...`);

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_INSTRUCTIONS[dataType],
    tools: { code_execution: google.tools.codeExecution({}) },
    prompt: `${dataType.toUpperCase()} data for ${month}:\n${data}\n\n${GENERATION_PROMPTS[dataType]}`,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: -1,
        },
      },
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

  console.log(`${dataType} blog post generated`);

  return result;
};

/**
 * Generates and saves a blog post without WorkflowContext dependency.
 * Can be used in both workflow and non-workflow contexts (e.g., Admin app).
 * Handles the complete flow: generation, title extraction, saving, and cache revalidation.
 *
 * @param params - Blog generation parameters (data, month, dataType)
 * @returns Result with post ID, title, slug, and success status
 */
export const generateAndSavePost = async (
  params: BlogGenerationParams,
): Promise<GenerateAndSaveResult> => {
  const { month, dataType } = params;

  try {
    // Generate blog content using shared logic
    const { text, usage, response } = await generateBlogContent(params);

    console.log(`${dataType} blog post generated, saving to database...`);

    // Extract title from the first line (assuming it starts with # Title)
    const lines = text.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Save to database (upsert behavior)
    const post = await savePost({
      title,
      content: text,
      metadata: {
        month,
        dataType,
        responseId: response.id,
        modelId: response.modelId,
        timestamp: response.timestamp,
        usage,
      },
    });

    console.log(`${dataType} blog post saved successfully`);

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
      slug: post.slug,
    };
  } finally {
    // Shutdown tracing to flush remaining spans (even on error)
    await shutdownTracing();
  }
};

export const generatePost = async (
  context: WorkflowContext,
  params: BlogGenerationParams,
): Promise<BlogResult> => {
  const { dataType } = params;

  return context.run(`Generate blog post for ${dataType}`, async () => {
    // Use the shared generate and save function
    const result = await generateAndSavePost(params);

    console.log(`${dataType} blog post generation completed`);

    return result;
  });
};
