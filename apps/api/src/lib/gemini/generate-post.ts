import { SITE_URL } from "@api/config";
import { savePost } from "@api/lib/workflows/save-post";
import { GoogleGenAI } from "@google/genai";
import type { WorkflowContext } from "@upstash/workflow";
import {
  type BlogGenerationParams,
  type BlogResult,
  GEMINI_CONFIG,
  GEMINI_MODEL,
  GENERATION_PROMPTS,
  SYSTEM_INSTRUCTIONS,
} from "./config";

export const generatePost = async (
  context: WorkflowContext,
  params: BlogGenerationParams,
): Promise<BlogResult> => {
  const { data, month, dataType } = params;

  return context.run(`Generate blog post for ${dataType}`, async () => {
    console.log(`${dataType} blog post generation started...`);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${dataType.toUpperCase()} data for ${month}: ${data.join("\n")}\n\n${GENERATION_PROMPTS[dataType]}`,
            },
          ],
        },
      ],
      config: {
        ...GEMINI_CONFIG,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTIONS[dataType] }],
        },
      },
    });

    const blogContent = response.text;
    console.log(`${dataType} blog post generated, saving to database...`);

    // Extract title from the first line (assuming it starts with # Title)
    const lines = blogContent.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Save to database
    const post = await savePost({
      title,
      content: blogContent,
      metadata: {
        month,
        dataType,
        modelVersion: response.modelVersion,
        responseId: response.responseId,
        createTime: response.createTime,
        usageMetadata: response.usageMetadata,
      },
    });

    console.log(`${dataType} blog post generation completed`);

    // Revalidate blog cache
    try {
      const revalidateUrl = `${SITE_URL}/api/revalidate`;
      const revalidateResponse = await fetch(revalidateUrl, {
        method: "POST",
        headers: {
          "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
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

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
      slug: post.slug,
    };
  });
};
