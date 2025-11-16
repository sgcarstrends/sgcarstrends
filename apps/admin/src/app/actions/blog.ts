"use server";

import { auth } from "@admin/lib/auth";
import {
  generateBlogContent,
  getCarsAggregatedByMonth,
  getCoeForMonth,
  shutdownTracing,
} from "@sgcarstrends/ai";
import { db, posts } from "@sgcarstrends/database";
import { slugify, tokeniser } from "@sgcarstrends/utils";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

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

    const { text, usage, response } = await generateBlogContent({
      data,
      month,
      dataType,
    });

    console.log(`${dataType} blog post generated, saving to database...`);

    // Extract title from the first line (assuming it starts with # Title)
    const lines = text.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Generate slug from title
    const slug = slugify(title);

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

    // Shutdown tracing to flush remaining spans
    await shutdownTracing();

    return {
      success: true,
      postId: post.id,
    };
  } catch (error) {
    console.error("Error regenerating post:", error);

    // Shutdown tracing even on error to flush spans
    await shutdownTracing();

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
