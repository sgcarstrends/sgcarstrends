"use server";

import { db, posts } from "@sgcarstrends/database";
import { redis } from "@sgcarstrends/utils";
import { desc, inArray, isNotNull } from "drizzle-orm";

const getPostByIds = async (postIds: string[]) => {
  if (postIds.length === 0) {
    return [];
  }

  return db.query.posts.findMany({
    where: inArray(posts.id, postIds),
    orderBy: desc(posts.publishedAt),
  });
};

const getTagSimilarPosts = async (
  postId: string,
  limit: number,
): Promise<Array<{ postId: string; score: number }>> => {
  try {
    // Get tags for the current post
    const tags = await redis.smembers(`blog:post:tags:${postId}`);

    if (tags.length === 0) {
      return [];
    }

    const similarPosts = new Map<string, number>();

    // For each tag, find other posts with the same tag
    for (const tag of tags) {
      const postsWithTag = await redis.smembers(`blog:tags:${tag}`);

      for (const otherPostId of postsWithTag) {
        if (otherPostId !== postId) {
          // Increment score for each shared tag
          similarPosts.set(
            otherPostId,
            (similarPosts.get(otherPostId) ?? 0) + 1,
          );
        }
      }
    }

    // Sort by number of shared tags and return top results
    return Array.from(similarPosts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([postId, score]) => ({ postId, score }));
  } catch (error) {
    console.error("Error getting tag similar posts:", error);
    return [];
  }
};

const getPopularPosts = async (
  limit: number = 10,
): Promise<Array<{ postId: string; viewCount: number }>> => {
  try {
    // Get top posts by view count (highest to lowest) using zrange with REV
    const results = await redis.zrange("blog:popular", 0, limit - 1, {
      withScores: true,
      rev: true,
    });

    // Transform the results into a more usable format
    const popularPosts: Array<{ postId: string; viewCount: number }> = [];

    for (let i = 0; i < results.length; i += 2) {
      popularPosts.push({
        postId: results[i] as string,
        viewCount: results[i + 1] as number,
      });
    }

    return popularPosts;
  } catch (error) {
    console.error("Error getting popular posts:", error);
    return [];
  }
};

export const getRelatedPosts = async (postId: string, limit: number = 3) => {
  try {
    const [tagRelated, popular] = await Promise.all([
      getTagSimilarPosts(postId, limit * 2),
      getPopularPosts(limit * 2),
    ]);

    // Hybrid scoring: 70% tag similarity + 30% popularity
    const scoredPosts = new Map<string, number>();

    // Add tag similarity scores
    tagRelated.forEach(({ postId: id, score }) => {
      scoredPosts.set(id, score * 0.7);
    });

    // Add popularity scores (normalized)
    popular.forEach(({ postId: id }, index) => {
      const popularityScore = (popular.length - index) / popular.length;
      const currentScore = scoredPosts.get(id) ?? 0;
      scoredPosts.set(id, currentScore + popularityScore * 0.3);
    });

    // Remove current post and sort by score
    scoredPosts.delete(postId);

    const relatedPostIds = Array.from(scoredPosts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([postId]) => postId);

    if (relatedPostIds.length === 0) {
      return [];
    }

    // Get full post data for the related posts
    const posts = await getPostByIds(relatedPostIds);

    // Sort posts based on the related posts order
    return relatedPostIds
      .map((id) => posts.find((post) => post.id === id))
      .filter((post) => post !== undefined);
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
};
