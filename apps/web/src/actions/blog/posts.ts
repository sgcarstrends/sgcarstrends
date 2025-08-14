"use server";

import { posts } from "@sgcarstrends/database";
import { db } from "@web/config/db";
import { desc, eq, inArray, isNotNull } from "drizzle-orm";

export const getAllPosts = async () => {
  try {
    return await db
      .select()
      .from(posts)
      .where(isNotNull(posts.publishedAt))
      .orderBy(desc(posts.publishedAt));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    return post;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
  }
};

export const getPostsByIds = async (postIds: string[]) => {
  try {
    if (postIds.length === 0) return [];

    return await db
      .select()
      .from(posts)
      .where(inArray(posts.id, postIds))
      .orderBy(desc(posts.publishedAt));
  } catch (error) {
    console.error("Error fetching posts by IDs:", error);
    return [];
  }
};
