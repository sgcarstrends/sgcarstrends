import { db, posts } from "@sgcarstrends/database";
import { redis, slugify } from "@sgcarstrends/utils";
import type { LanguageModelUsage } from "ai";
import type { Highlight } from "./schemas";

const getPostPublishRevalidationTags = (slug: string): string[] => {
  return ["posts:list", "posts:recent", `posts:slug:${slug}`];
};

export interface PostParams {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  highlights: Highlight[];
  month: string;
  dataType: "cars" | "coe";
  responseMetadata: {
    responseId: string;
    modelId: string;
    timestamp: Date;
    usage?: LanguageModelUsage;
  };
}

export const savePost = async (data: PostParams) => {
  const slug = slugify(data.title);

  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      highlights: data.highlights,
      status: "published",
      metadata: data.responseMetadata,
      month: data.month,
      dataType: data.dataType,
      publishedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [posts.month, posts.dataType],
      set: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        tags: data.tags,
        highlights: data.highlights,
        metadata: data.responseMetadata,
        modifiedAt: new Date(),
      },
    })
    .returning();

  console.log(
    `[BLOG_SAVE] Post saved successfully - id: ${post.id}, slug: ${post.slug}, month: ${data.month}, category: ${data.dataType}`,
  );

  // Sync tags to Redis for related posts functionality
  if (data.tags && data.tags.length > 0) {
    await syncPostTags(post.id, data.tags);
  }

  // Invalidate cache for the blog post
  await revalidateWebCache(post.slug);

  return post;
};

/**
 * Revalidates web app cache for blog posts
 */
async function revalidateWebCache(slug: string): Promise<void> {
  try {
    const webUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const revalidateToken = process.env.REVALIDATE_TOKEN;
    const fallbackToken = process.env.NEXT_PUBLIC_REVALIDATE_TOKEN;

    if (!revalidateToken && !fallbackToken) {
      console.warn(
        "[BLOG_SAVE] REVALIDATE_TOKEN not set, skipping cache invalidation",
      );
      return;
    }

    if (!revalidateToken && fallbackToken) {
      console.warn(
        "[BLOG_SAVE] Using NEXT_PUBLIC_REVALIDATE_TOKEN fallback. Set REVALIDATE_TOKEN instead.",
      );
    }

    const response = await fetch(`${webUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": revalidateToken ?? fallbackToken ?? "",
      },
      body: JSON.stringify({
        tags: getPostPublishRevalidationTags(slug),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(
        `[BLOG_SAVE] Cache invalidation failed: ${response.status} ${error}`,
      );
    } else {
      const result = await response.json();
      console.log(
        `[BLOG_SAVE] Cache invalidated successfully for blog post: ${slug}`,
        result,
      );
    }
  } catch (error) {
    console.error(
      "[BLOG_SAVE] Error invalidating cache:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

/**
 * Syncs post tags to Redis for related posts functionality
 * Creates bidirectional mappings:
 * - posts:{id}:tags (set) - tags for a post
 * - tags:{slug}:posts (sorted set) - posts with this tag, score=1 for zunion aggregation
 */
async function syncPostTags(postId: string, tags: string[]): Promise<void> {
  try {
    // Clear existing tags for this post
    const existingTags = await redis.smembers(`posts:${postId}:tags`);
    if (existingTags.length > 0) {
      const pipeline = redis.pipeline();
      for (const tag of existingTags) {
        pipeline.zrem(`tags:${tag}:posts`, postId);
      }
      pipeline.del(`posts:${postId}:tags`);
      await pipeline.exec();
    }

    // Add new tags (bidirectional mapping)
    {
      const pipeline = redis.pipeline();
      for (const tag of tags) {
        const tagSlug = slugify(tag);
        pipeline.zadd(`tags:${tagSlug}:posts`, { score: 1, member: postId });
        pipeline.sadd(`posts:${postId}:tags`, tagSlug);
      }
      await pipeline.exec();
    }

    console.log(
      `[BLOG_SAVE] Tags synced for post ${postId}: ${tags.join(", ")}`,
    );
  } catch (error) {
    console.error(
      "[BLOG_SAVE] Failed to sync tags:",
      error instanceof Error ? error.message : String(error),
    );
  }
}
