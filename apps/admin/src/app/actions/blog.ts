"use server";

import { auth } from "@admin/lib/auth";
import { revalidateWebCache } from "@admin/lib/revalidate";
import {
  generateAndSavePost,
  getCarsAggregatedByMonth,
  getCoeForMonth,
} from "@sgcarstrends/ai";
import { db, posts } from "@sgcarstrends/database";
import { tokeniser } from "@sgcarstrends/utils";
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
    throw new Error("Unauthorised");
  }

  try {
    const allPosts = await db
      .select()
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
      error: "Unauthorised",
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

    // Use shared generate and save function
    const result = await generateAndSavePost({
      data,
      month,
      dataType,
    });

    // Invalidate cache for new blog post
    await revalidateWebCache(["posts:list", "posts:recent"]);

    return {
      success: true,
      postId: result.postId,
    };
  } catch (error) {
    console.error("Error regenerating post:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
