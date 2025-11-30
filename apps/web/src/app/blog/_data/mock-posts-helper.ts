/**
 * Mock Posts Helper
 *
 * This file consolidates all mock post logic for easy removal.
 *
 * TO REMOVE MOCK POSTS:
 * 1. Delete this file (mock-posts-helper.ts)
 * 2. Delete mock-posts.ts
 * 3. In [slug]/page.tsx:
 *    - Remove import: import { getPostWithMocks, getAllPostsWithMocks } from "@web/app/blog/_data/mock-posts-helper";
 *    - Replace: getPostWithMocks(slug) → getPostBySlug(slug)
 *    - Replace: getAllPostsWithMocks() → getAllPosts()
 * 4. In page.tsx (blog listing):
 *    - Remove import: import { mockPosts } from "@web/app/blog/_data/mock-posts";
 *    - Remove import: import { FEATURE_FLAG_UNRELEASED } from "@web/config";
 *    - Replace: const posts = FEATURE_FLAG_UNRELEASED ? [...mockPosts, ...realPosts] : realPosts;
 *      → const posts = await getAllPosts();
 */

import { FEATURE_FLAG_UNRELEASED } from "@web/config";
import { getAllPosts, getPostBySlug } from "@web/queries/posts";
import { mockPosts } from "./mock-posts";

/**
 * Get a post by slug, checking mock posts first when feature flag is enabled
 */
export const getPostWithMocks = async (slug: string) => {
  if (FEATURE_FLAG_UNRELEASED) {
    const mockPost = mockPosts.find((post) => post.slug === slug);
    if (mockPost) {
      return mockPost;
    }
  }
  return getPostBySlug(slug);
};

/**
 * Get all posts, including mock posts when feature flag is enabled
 */
export const getAllPostsWithMocks = async () => {
  const realPosts = await getAllPosts();
  if (FEATURE_FLAG_UNRELEASED) {
    return [...mockPosts, ...realPosts];
  }
  return realPosts;
};
