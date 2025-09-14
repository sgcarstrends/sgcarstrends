"use server";

import { redis } from "@sgcarstrends/utils";
import { getPostsByIds } from "./posts";
import { getPopularPosts } from "./views";

export const updatePostTags = async (
  postId: string,
  tags: string[],
): Promise<void> => {
  try {
    // Get current tags for this post
    const currentTags = await redis.smembers(`blog:post:tags:${postId}`);

    // Remove post from old tag sets
    for (const tag of currentTags) {
      await redis.srem(`blog:tags:${tag}`, postId);
    }

    // Clear the post's tag set
    await redis.del(`blog:post:tags:${postId}`);

    // Add post to new tag sets
    for (const tag of tags) {
      await redis.sadd(`blog:tags:${tag}`, postId);
      await redis.sadd(`blog:post:tags:${postId}`, tag);
    }
  } catch (error) {
    console.error("Error updating post tags:", error);
  }
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
    const posts = await getPostsByIds(relatedPostIds);

    // Sort posts based on the related posts order
    return relatedPostIds.reduce<typeof posts>((orderedPosts, id) => {
      const post = posts.find((post) => post.id === id);
      if (post) {
        orderedPosts.push(post);
      }
      return orderedPosts;
    }, []);
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
};
