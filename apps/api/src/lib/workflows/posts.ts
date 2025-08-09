import { getCarsByMonth } from "@api/lib/workflows/queries/cars";
import { savePost } from "@api/lib/workflows/save-post";
import {
  createPartFromText,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
import type { WorkflowContext } from "@upstash/workflow";

export const generatePost = (context: WorkflowContext, month: string) => {
  return context.run("Generate post", async () => {
    // Get car data from database
    const cars = await getCarsByMonth(month);

    const data = cars.map((row) => JSON.stringify(row));

    console.log("Blog post generation started...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const config = {
      thinkingConfig: {
        thinkingBudget: 8192,
      },
      responseMimeType: "text/plain",
    };
    const model = "gemini-2.5-pro";
    const cache = await ai.caches.create({
      model,
      config: {
        contents: createUserContent(
          createPartFromText(
            `Car registration data for ${month}: ${data.join("\n")}`,
          ),
        ),
        systemInstruction: `You are a data analyst specialising in Singapore's car market.
          Analyse the provided car registration data and write a blog post in markdown format.
          
          Guidelines:
          - Write a compelling title that includes the month/year
          - Start with an executive summary of key trends
          - Include specific data points and percentages where relevant
          - Analyse fuel type trends (petrol, hybrid, electric)
          - Discuss popular vehicle types and makes
          - Provide market insights and implications
          - Keep the tone professional but accessible
          - Use proper markdown formatting with headers, bullet points, etc.
          - Aim for 300-500 words
          
          Output only the post content in markdown format, starting with the title as # header.`,
      },
    });

    const response = await ai.models.generateContent({
      model,
      contents:
        "Generate a comprehensive blog post analysing the car registration trends for this month.",
      config: {
        ...config,
        cachedContent: cache.name,
      },
    });

    const blogContent = response.text;
    console.log("Blog post generated, saving to database...");

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
        dataType: "cars",
        modelVersion: response.modelVersion,
        responseId: response.responseId,
        createTime: response.createTime,
        usageMetadata: response.usageMetadata,
      },
    });

    console.log("Blog post generation completed");

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
    };
  });
};
