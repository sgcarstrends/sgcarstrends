"use server";

import { redis } from "@sgcarstrends/utils";

export const updatePostTags = async (
  postId: string,
  tags: string[],
): Promise<void> => {
  try {
    // Get current tags for this post
    const currentTags = await redis.smembers(`blog:post:tags:${postId}`);

    // Remove post from old tag sets
    for (const tag of currentTags) {
      await redis.srem(`blog:tags:${tag}`, postId);
    }

    // Clear the post's tag set
    await redis.del(`blog:post:tags:${postId}`);

    // Add post to new tag sets
    for (const tag of tags) {
      await redis.sadd(`blog:tags:${tag}`, postId);
      await redis.sadd(`blog:post:tags:${postId}`, tag);
    }
  } catch (error) {
    console.error("Error updating post tags:", error);
  }
};
