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
