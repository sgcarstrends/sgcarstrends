import { google } from "@ai-sdk/google";
import type { WorkflowContext } from "@upstash/workflow";
import { generateObject, generateText } from "ai";
import {
  ANALYSIS_INSTRUCTIONS,
  ANALYSIS_PROMPTS,
  type BlogGenerationParams,
  type BlogResult,
  GENERATION_INSTRUCTIONS,
  GENERATION_PROMPTS,
} from "./config";
import { shutdownTracing, startTracing } from "./instrumentation";
import { savePost } from "./save-post";
import { type GeneratedPost, postSchema } from "./schemas";

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
 * Result of the 2-step blog content generation
 */
export interface GenerateBlogContentResult {
  object: GeneratedPost;
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

/**
 * Standalone blog content generation function without WorkflowContext dependency.
 * Uses a 2-step flow for accuracy and type-safety:
 *
 * Step 1: Code Execution - Analyse data with Python code execution for accurate calculations
 * Step 2: Structured Output - Generate validated blog content matching the postSchema
 *
 * @param params - Blog generation parameters (data, month, dataType)
 * @returns Generated post object with usage stats and response metadata
 */
export const generateBlogContent = async (
  params: BlogGenerationParams,
): Promise<GenerateBlogContentResult> => {
  const { data, month, dataType } = params;

  // Initialize LangFuse tracing
  startTracing();

  console.log(`[STEP 1] ${dataType} data analysis started...`);

  // STEP 1: Code Execution for accurate analysis
  const analysisResult = await generateText({
    model: google("gemini-2.5-flash"),
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
  const { object, usage, response } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: postSchema,
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
    object,
    usage: {
      inputTokens: usage.inputTokens ?? 0,
      outputTokens: usage.outputTokens ?? 0,
      totalTokens: usage.totalTokens ?? 0,
    },
    response: {
      id: response.id,
      modelId: response.modelId,
      timestamp: response.timestamp,
    },
  };
};

/**
 * Generates and saves a blog post without WorkflowContext dependency.
 * Can be used in both workflow and non-workflow contexts (e.g., Admin app).
 * Uses 2-step flow (analysis + structured output) for accuracy and type-safety.
 *
 * @param params - Blog generation parameters (data, month, dataType)
 * @returns Result with post ID, title, slug, and success status
 */
export const generateAndSavePost = async (
  params: BlogGenerationParams,
): Promise<GenerateAndSaveResult> => {
  const { month, dataType } = params;

  try {
    // Generate blog content using 2-step flow
    const { object, usage, response } = await generateBlogContent(params);

    console.log(`${dataType} blog post generated, saving to database...`);

    // Save to database using structured output fields directly
    const post = await savePost({
      title: object.title,
      content: object.content,
      excerpt: object.excerpt,
      tags: object.tags,
      highlights: object.highlights,
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
