import { redis, slugify } from "@sgcarstrends/utils";

/**
 * Syncs post tags to Redis for related posts functionality.
 * Creates bidirectional mappings:
 * - posts:{id}:tags (set) - tags for a post
 * - tags:{slug}:posts (sorted set) - posts with this tag
 */
export async function syncPostTags(
  postId: string,
  tags: string[],
): Promise<void> {
  try {
    const existingTags = await redis.smembers(`posts:${postId}:tags`);
    if (existingTags.length > 0) {
      const pipeline = redis.pipeline();
      for (const tag of existingTags) {
        pipeline.zrem(`tags:${tag}:posts`, postId);
      }
      pipeline.del(`posts:${postId}:tags`);
      await pipeline.exec();
    }

    const pipeline = redis.pipeline();
    for (const tag of tags) {
      const tagSlug = slugify(tag);
      pipeline.zadd(`tags:${tagSlug}:posts`, { score: 1, member: postId });
      pipeline.sadd(`posts:${postId}:tags`, tagSlug);
    }
    await pipeline.exec();
  } catch (error) {
    console.error(
      "[POST_TAGS] Failed to sync tags:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

/**
 * Cleans up all Redis tag mappings for a post.
 * Removes bidirectional mappings before post deletion.
 */
export async function cleanupPostTags(
  postId: string,
  tags: string[],
): Promise<void> {
  try {
    const pipeline = redis.pipeline();
    for (const tag of tags) {
      const tagSlug = slugify(tag);
      pipeline.zrem(`tags:${tagSlug}:posts`, postId);
    }
    pipeline.del(`posts:${postId}:tags`);
    await pipeline.exec();
  } catch (error) {
    console.error(
      "[POST_TAGS] Failed to cleanup tags:",
      error instanceof Error ? error.message : String(error),
    );
  }
}
