import { db, posts } from "@sgcarstrends/database";
import { slugify } from "@sgcarstrends/utils";
import type { Highlight } from "./schemas";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

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
    usage?: TokenUsage;
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

    const revalidateToken = process.env.NEXT_PUBLIC_REVALIDATE_TOKEN;

    if (!revalidateToken) {
      console.warn(
        "[BLOG_SAVE] NEXT_PUBLIC_REVALIDATE_TOKEN not set, skipping cache invalidation",
      );
      return;
    }

    const response = await fetch(`${webUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": revalidateToken,
      },
      body: JSON.stringify({
        tags: ["posts:list", "posts:recent", `posts:slug:${slug}`],
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
