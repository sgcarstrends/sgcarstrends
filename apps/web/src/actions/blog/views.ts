"use server";

import { redis } from "@sgcarstrends/utils";
import { updateTag } from "next/cache";

export const incrementPostView = async (postId: string): Promise<number> => {
  try {
    // Simply increment the view count
    const newCount = await redis.incr(`blog:views:${postId}`);

    // Update popular posts ranking
    await redis.zadd("blog:popular", { score: newCount, member: postId });

    // Use updateTag for immediate cache refresh with read-your-writes semantics
    // This ensures the view counter updates immediately in the same request
    updateTag(`views-${postId}`);

    return newCount;
  } catch (error) {
    console.error("Error incrementing post view:", error);
    // Return 0 if Redis fails
    return 0;
  }
};

export const getPostViewCount = async (postId: string): Promise<number> => {
  try {
    const count = await redis.get(`blog:views:${postId}`);
    return parseInt((count as string) ?? "0", 10);
  } catch (error) {
    console.error("Error getting post view count:", error);
    return 0;
  }
};

export const getPopularPosts = async (
  limit: number = 10,
): Promise<Array<{ postId: string; viewCount: number }>> => {
  try {
    // Get top posts by view count (highest to lowest) using zrange with REV
    const results = await redis.zrange("blog:popular", 0, limit - 1, {
      withScores: true,
      rev: true,
    });

    // Transform the results into a more usable format
    const popularPosts: Array<{ postId: string; viewCount: number }> = [];

    for (let i = 0; i < results.length; i += 2) {
      popularPosts.push({
        postId: results[i] as string,
        viewCount: results[i + 1] as number,
      });
    }

    return popularPosts;
  } catch (error) {
    console.error("Error getting popular posts:", error);
    return [];
  }
};
