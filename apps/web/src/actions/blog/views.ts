"use server";

import { redis } from "@sgcarstrends/utils";

export const incrementPostView = async (postId: string): Promise<number> => {
  try {
    const newCount = await redis.incr(`blog:views:${postId}`);

    await redis.zadd("blog:popular", { score: newCount, member: postId });

    return newCount;
  } catch (error) {
    console.error("Error incrementing post view:", error);
    return 0;
  }
};

export const getPostViewCount = async (postId: string): Promise<number> => {
  try {
    const count = await redis.get<string>(`blog:views:${postId}`);
    return Number.parseInt(count ?? "0", 10);
  } catch (error) {
    console.error("Error getting post view count:", error);
    return 0;
  }
};
