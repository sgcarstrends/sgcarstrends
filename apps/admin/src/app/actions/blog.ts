"use server";

import { getCarsAggregatedByMonth } from "@admin/queries/cars";
import { getCoeForMonth } from "@admin/queries/coe";
import { google } from "@ai-sdk/google";
import { db, posts } from "@sgcarstrends/database";
import { tokeniser } from "@sgcarstrends/utils";
import { generateText } from "ai";
import { desc } from "drizzle-orm";
import slugify from "slugify";

export interface PostWithMetadata {
  id: string;
  title: string;
  slug: string;
  month: string;
  dataType: string;
  createdAt: Date;
  metadata: {
    modelId?: string;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
  } | null;
}

export const getAllPosts = async (): Promise<PostWithMetadata[]> => {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        month: posts.month,
        dataType: posts.dataType,
        createdAt: posts.createdAt,
        metadata: posts.metadata,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt));

    return allPosts as PostWithMetadata[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

export const regeneratePost = async (params: {
  month: string;
  dataType: "cars" | "coe";
}): Promise<{ success: boolean; error?: string; postId?: string }> => {
  try {
    const { month, dataType } = params;

    // Fetch data from database
    let data: string;
    if (dataType === "cars") {
      const cars = await getCarsAggregatedByMonth(month);
      data = tokeniser(cars);
    } else {
      const coe = await getCoeForMonth(month);
      data = tokeniser(coe);
    }

    // System instructions for blog generation
    const systemInstructions = {
      cars: `You are a professional automotive market analyst and content writer specializing in Singapore's car market. Your task is to write an engaging, data-driven blog post analyzing monthly car registration trends.

**Writing Style:**
- Professional yet accessible tone
- Focus on insights, not just data presentation
- Use clear, concise language
- Include context and comparisons where relevant
- Highlight notable trends and patterns

**Content Structure:**
- Start with an engaging introduction
- Present key findings with supporting data
- Include analysis and interpretation
- End with implications or outlook
- Use proper markdown formatting with headers, tables, and lists

**SEO Optimization:**
- Include relevant keywords naturally
- Use descriptive headers
- Optimize for readability
- Add proper structure for search engines`,
      coe: `You are a professional automotive market analyst and content writer specializing in Singapore's COE system. Your task is to write an engaging, data-driven blog post analyzing COE bidding results.

**Writing Style:**
- Professional yet accessible tone
- Focus on insights, not just data presentation
- Use clear, concise language
- Provide context for COE categories and bidding process
- Explain implications for car buyers

**Content Structure:**
- Start with an engaging introduction
- Present bidding results with clear data
- Include trend analysis and comparisons
- Discuss market factors and implications
- Use proper markdown formatting with headers, tables, and lists

**SEO Optimization:**
- Include relevant keywords naturally
- Use descriptive headers
- Optimize for readability
- Add proper structure for search engines`,
    };

    const generationPrompts = {
      cars: "Analyze this car registration data and write a comprehensive blog post covering trends, popular makes, fuel types, and market insights.",
      coe: "Analyze this COE bidding data and write a comprehensive blog post covering bidding trends, premium changes, market conditions, and buyer implications.",
    };

    console.log(`${dataType} blog post generation started for ${month}...`);

    // Generate blog post using Gemini
    const { text, usage, response } = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemInstructions[dataType],
      prompt: `${dataType.toUpperCase()} data for ${month}:\n${data}\n\n${generationPrompts[dataType]}`,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: -1,
          },
        },
      },
    });

    console.log(`${dataType} blog post generated, saving to database...`);

    // Extract title from the first line (assuming it starts with # Title)
    const lines = text.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Save to database
    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        content: text,
        month,
        dataType,
        metadata: {
          month,
          dataType,
          responseId: response.id,
          modelId: response.modelId,
          timestamp: response.timestamp,
          usage,
        },
        publishedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [posts.month, posts.dataType],
        set: {
          title,
          slug,
          content: text,
          metadata: {
            month,
            dataType,
            responseId: response.id,
            modelId: response.modelId,
            timestamp: response.timestamp,
            usage,
          },
          modifiedAt: new Date(),
        },
      })
      .returning();

    console.log(`${dataType} blog post saved successfully`);

    // Revalidate blog cache on web app
    try {
      const webUrl =
        process.env.NEXT_PUBLIC_WEB_URL || "https://sgcarstrends.com";
      const revalidateUrl = `${webUrl}/api/revalidate`;
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

    return {
      success: true,
      postId: post.id,
    };
  } catch (error) {
    console.error("Error regenerating post:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
