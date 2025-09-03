import { db } from "@api/config/db";
import type { GenerateContentResponse } from "@google/genai";
import { posts } from "@sgcarstrends/database";
import slugify from "@sindresorhus/slugify";
import { eq } from "drizzle-orm";

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

  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (existingPost) {
    console.log(`Blog post with slug "${slug}" already exists, skipping save`);
    return existingPost;
  }

  const [newPost] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      content: data.content,
      metadata: data.metadata,
      publishedAt: new Date(),
    })
    .returning();

  console.log(`Blog post saved with ID: ${newPost.id}, slug: ${newPost.slug}`);

  return newPost;
};
