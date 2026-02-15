import { db, posts } from "@sgcarstrends/database";
import { redis, slugify } from "@sgcarstrends/utils";
import { getPostPublishRevalidationTags } from "@web/lib/cache-tags/posts";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  highlights: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        detail: z.string(),
      }),
    )
    .optional(),
  month: z.string().optional(),
  dataType: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createPost = async (input: CreatePostInput) => {
  const slug = slugify(input.title);
  const publishedAt = input.status === "published" ? new Date() : undefined;

  const values = {
    title: input.title,
    slug,
    content: input.content,
    excerpt: input.excerpt,
    heroImage: input.heroImage,
    tags: input.tags,
    highlights: input.highlights,
    status: input.status,
    month: input.month,
    dataType: input.dataType,
    publishedAt,
  };

  const hasConflictTarget = input.month && input.dataType;

  const [post] = hasConflictTarget
    ? await db
        .insert(posts)
        .values(values)
        .onConflictDoUpdate({
          target: [posts.month, posts.dataType],
          set: {
            title: input.title,
            slug,
            content: input.content,
            excerpt: input.excerpt,
            heroImage: input.heroImage,
            tags: input.tags,
            highlights: input.highlights,
            status: input.status,
            modifiedAt: new Date(),
            publishedAt,
          },
        })
        .returning()
    : await db.insert(posts).values(values).returning();

  // Sync tags to Redis for related posts functionality
  if (input.tags && input.tags.length > 0) {
    await syncPostTags(post.id, input.tags);
  }

  // Revalidate cache directly (same Next.js process)
  for (const tag of getPostPublishRevalidationTags(slug)) {
    revalidateTag(tag, "max");
  }

  return post;
};

/**
 * Syncs post tags to Redis for related posts functionality.
 * Creates bidirectional mappings:
 * - posts:{id}:tags (set) - tags for a post
 * - tags:{slug}:posts (sorted set) - posts with this tag
 */
async function syncPostTags(postId: string, tags: string[]): Promise<void> {
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
      "[CREATE_POST] Failed to sync tags:",
      error instanceof Error ? error.message : String(error),
    );
  }
}
