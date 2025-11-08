import { db, posts } from "@sgcarstrends/database";
import slugify from "@sindresorhus/slugify";
import type { LanguageModelResponseMetadata, LanguageModelUsage } from "ai";
import { and, eq } from "drizzle-orm";

export interface PostMetadata {
  month: string;
  dataType: "cars" | "coe";
  responseId: LanguageModelResponseMetadata["id"];
  modelId: LanguageModelResponseMetadata["modelId"];
  timestamp: LanguageModelResponseMetadata["timestamp"];
  usage: LanguageModelUsage;
}

export interface BlogPost {
  title: string;
  content: string;
  metadata: PostMetadata;
}

export const savePost = async (data: BlogPost) => {
  const slug = slugify(data.title);
  const { month, dataType } = data.metadata;

  // Check for existing post with same month + category combination
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.month, month), eq(posts.dataType, dataType)))
    .limit(1);

  if (existingPost) {
    console.log(
      `[BLOG_SAVE] Post for ${dataType} ${month} already exists (id: ${existingPost.id}), skipping save`,
    );
    return existingPost;
  }

  // Use INSERT with ON CONFLICT DO NOTHING for atomic operation
  const [newPost] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      content: data.content,
      metadata: data.metadata,
      publishedAt: new Date(),
      month,
      dataType,
    })
    .onConflictDoNothing({
      target: [posts.month, posts.dataType],
    })
    .returning();

  // If insert was skipped due to conflict, fetch existing post
  if (!newPost) {
    const [conflictedPost] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.month, month), eq(posts.dataType, dataType)))
      .limit(1);

    console.log(
      `[BLOG_SAVE] Post for ${dataType} ${month} was created by another process (id: ${conflictedPost?.id})`,
    );
    return conflictedPost;
  }

  console.log(
    `[BLOG_SAVE] Post saved successfully - id: ${newPost.id}, slug: ${newPost.slug}, month: ${month}, category: ${dataType}`,
  );

  // Invalidate cache for the new blog post
  await revalidateWebCache(newPost.slug);

  return newPost;
};

/**
 * Revalidates web app cache for blog posts
 */
async function revalidateWebCache(slug: string): Promise<void> {
  try {
    const stage = process.env.STAGE || "dev";
    const webUrl =
      stage === "prod"
        ? "https://sgcarstrends.com"
        : `https://${stage}.sgcarstrends.com`;

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
        tags: ["all-blogs", "blog", `blog-${slug}`],
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
