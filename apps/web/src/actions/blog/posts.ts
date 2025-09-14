"use server";

import { posts } from "@web/queries";
import { RevalidateTags } from "@web/types";
import { unstable_cache } from "next/cache";

export const getAllPosts = unstable_cache(
  async () => {
    try {
      return await posts.getAllPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },
  ["posts"],
  { tags: [RevalidateTags.Blog] },
);

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
