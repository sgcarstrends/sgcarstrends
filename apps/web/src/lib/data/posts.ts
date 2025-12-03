import { redis } from "@sgcarstrends/utils";
import { getPostsByIds } from "@web/queries/posts";
import { cacheLife, cacheTag } from "next/cache";

export async function getPostViewCount(postId: string): Promise<number> {
  "use cache";
  cacheLife("max");
  cacheTag(`posts:views:${postId}`);

  try {
    const score = await redis.zscore("blog:popular", postId);
    return score ?? 0;
  } catch (error) {
    console.error("Error getting post view count:", error);
    return 0;
  }
}

async function getTagSimilarPosts(
  postId: string,
  limit: number,
): Promise<Array<{ postId: string; score: number }>> {
  try {
    const tags = await redis.smembers(`posts:${postId}:tags`);

    if (tags.length === 0) {
      return [];
    }

    // Pipeline all zrange calls for single round-trip
    const pipeline = redis.pipeline();
    for (const tag of tags) {
      pipeline.zrange(`tags:${tag}:posts`, 0, -1);
    }
    const results = await pipeline.exec();

    // Score posts by number of matching tags
    const scoredPosts = new Map<string, number>();
    for (const posts of results) {
      for (const id of posts as string[]) {
        if (id !== postId) {
          scoredPosts.set(id, (scoredPosts.get(id) ?? 0) + 1);
        }
      }
    }

    return Array.from(scoredPosts.entries())
      .map(([postId, score]) => ({ postId, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting tag similar posts:", error);
    return [];
  }
}

export async function getPopularPosts(
  limit: number = 10,
): Promise<Array<{ postId: string; viewCount: number }>> {
  "use cache";
  cacheLife("max");
  cacheTag("posts:popular");

  try {
    const results = await redis.zrange("blog:popular", 0, limit - 1, {
      rev: true,
      withScores: true,
    });

    // Handle flat array format: [member1, score1, member2, score2, ...]
    const popularPosts: Array<{ postId: string; viewCount: number }> = [];
    for (let i = 0; i < results.length; i += 2) {
      popularPosts.push({
        postId: String(results[i]),
        viewCount: Number(results[i + 1]),
      });
    }

    return popularPosts;
  } catch (error) {
    console.error("Error getting popular posts:", error);
    return [];
  }
}

export async function getRelatedPosts(postId: string, limit: number = 3) {
  "use cache";
  cacheLife("max");
  cacheTag(`posts:related:${postId}`);

  try {
    const [tagRelated, popular] = await Promise.all([
      getTagSimilarPosts(postId, limit * 2),
      getPopularPosts(limit * 2),
    ]);

    const scoredPosts = new Map<string, number>();

    tagRelated.forEach(({ postId: id, score }) => {
      scoredPosts.set(id, score * 0.7);
    });

    popular.forEach(({ postId: id }, index) => {
      const popularityScore = (popular.length - index) / popular.length;
      const currentScore = scoredPosts.get(id) ?? 0;
      scoredPosts.set(id, currentScore + popularityScore * 0.3);
    });

    scoredPosts.delete(postId);

    const relatedPostIds = Array.from(scoredPosts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([postId]) => postId)
      .filter((id) => id?.trim().length > 0);

    if (relatedPostIds.length === 0) {
      return [];
    }

    const relatedPostsData = await getPostsByIds(relatedPostIds);

    return relatedPostIds.flatMap((id) => {
      const matchingPost = relatedPostsData.find((post) => post.id === id);
      return matchingPost ? [matchingPost] : [];
    });
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
}

export async function getPopularPostsWithData(limit = 5) {
  "use cache";
  cacheLife("max");
  cacheTag("posts:popular");

  const popular = await getPopularPosts(limit);
  if (popular.length === 0) return [];

  const postIds = popular.map((entry) => entry.postId);
  const posts = await getPostsByIds(postIds);

  // Preserve popularity order and attach view counts
  return popular.flatMap(({ postId, viewCount }) => {
    const post = posts.find((item) => item.id === postId);
    return post ? [{ ...post, viewCount }] : [];
  });
}
