"use server";

import { posts } from "@web/queries";
import { refresh } from "next/cache";

export const getAllPosts = async () => {
  try {
    const result = await posts.getAllPosts();

    // Refresh uncached data to ensure latest posts are shown
    refresh();

    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    return await posts.getPostBySlug(slug);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
  }
};

export const getPostsByIds = async (postIds: string[]) => {
  try {
    if (postIds.length === 0) return [];
    return await posts.getPostByIds(postIds);
  } catch (error) {
    console.error("Error fetching posts by IDs:", error);
    return [];
  }
};
