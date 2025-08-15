import { savePost } from "@api/lib/workflows/save-post";
import {
  createPartFromText,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
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

    const cache = await ai.caches.create({
      model: GEMINI_MODEL,
      config: {
        contents: createUserContent(
          createPartFromText(
            `${dataType.toUpperCase()} data for ${month}: ${data.join("\n")}`,
          ),
        ),
        systemInstruction: SYSTEM_INSTRUCTIONS[dataType],
      },
    });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: GENERATION_PROMPTS[dataType],
      config: {
        ...GEMINI_CONFIG,
        cachedContent: cache.name,
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

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
      slug: post.slug,
    };
  });
};
