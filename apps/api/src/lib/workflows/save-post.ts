import type { GenerateContentResponse } from "@google/genai";
import { db, posts } from "@sgcarstrends/database";
import slugify from "@sindresorhus/slugify";
import { and, eq } from "drizzle-orm";

export interface BlogPost {
  title: string;
  content: string;
  metadata: Partial<GenerateContentResponse> & {
    month: string;
    dataType: string;
  };
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

  return newPost;
};
