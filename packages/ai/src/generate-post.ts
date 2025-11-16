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

export const generatePost = async (
  context: WorkflowContext,
  params: BlogGenerationParams,
): Promise<BlogResult> => {
  const { month, dataType } = params;

  return context.run(`Generate blog post for ${dataType}`, async () => {
    // Generate blog content using shared logic
    const { text, usage, response } = await generateBlogContent(params);

    console.log(`${dataType} blog post generated, saving to database...`);

    // Extract title from the first line (assuming it starts with # Title)
    const lines = text.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Save to database
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

    console.log(`${dataType} blog post generation completed`);

    // Revalidate blog cache
    try {
      const stage = process.env.STAGE || "dev";
      const siteUrl =
        stage === "prod"
          ? "https://sgcarstrends.com"
          : `https://${stage}.sgcarstrends.com`;

      const revalidateUrl = `${siteUrl}/api/revalidate`;
      const revalidateResponse = await fetch(revalidateUrl, {
        method: "POST",
        headers: {
          "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
        },
        body: JSON.stringify({ tag: "blog" }),
        signal: AbortSignal.timeout(5000),
      });

      if (revalidateResponse.ok) {
        console.log("Blog cache revalidated successfully");
      } else {
        const text = await revalidateResponse.text();
        console.warn(
          `Blog cache revalidation failed with status: ${revalidateResponse.status}, response: ${text}`,
        );
      }
    } catch (error) {
      console.error("Error revalidating blog cache:", error);
      // Don't fail blog generation if revalidation fails
    }

    // Shutdown tracing to flush remaining spans
    await shutdownTracing();

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
      slug: post.slug,
    };
  });
};
