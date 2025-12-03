import { redis } from "@sgcarstrends/utils";
import { getPostsByIds } from "@web/queries/posts";
import { cacheLife, cacheTag } from "next/cache";

export async function getPostViewCount(postId: string): Promise<number> {
  "use cache";
  cacheLife("max");
  cacheTag(`posts:views:${postId}`);

  try {
    const count = await redis.get<string>(`blog:views:${postId}`);
    return Number.parseInt(count ?? "0", 10);
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

async function getPopularPosts(
  limit: number = 10,
): Promise<Array<{ postId: string; viewCount: number }>> {
  "use cache";
  cacheLife("max");
  cacheTag("posts:popular");

  try {
    const results = await redis.zrange<
      Array<{ member: string; score: number }>
    >("blog:popular", 0, limit - 1, {
      withScores: true,
      rev: true,
    });

    const popularPosts: Array<{ postId: string; viewCount: number }> = [];

    for (const entry of results) {
      popularPosts.push({
        postId: entry.member,
        viewCount: Number(entry.score),
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
