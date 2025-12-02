import { db, posts } from "@sgcarstrends/database";
import { and, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllPosts() {
  "use cache";
  cacheLife("max");
  cacheTag("posts:list");

  return db.query.posts.findMany({
    where: isNotNull(posts.publishedAt),
    orderBy: desc(posts.publishedAt),
  });
}

export async function getRecentPosts(limit = 3) {
  "use cache";
  cacheLife("max");
  cacheTag("posts:recent");

  return db.query.posts.findMany({
    where: isNotNull(posts.publishedAt),
    orderBy: desc(posts.publishedAt),
    limit,
  });
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`posts:slug:${slug}`);

  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), isNotNull(posts.publishedAt)),
  });
}

export async function getPostsByIds(postIds: string[]) {
  "use cache";
  cacheLife("max");
  cacheTag("posts:list");

  if (postIds.length === 0) {
    return [];
  }

  return db.query.posts.findMany({
    where: and(inArray(posts.id, postIds), isNotNull(posts.publishedAt)),
    orderBy: desc(posts.publishedAt),
  });
}

export async function getPostCountsByCategory() {
  "use cache";
  cacheLife("max");
  cacheTag("posts:list");

  return db
    .select({ category: posts.dataType, count: count() })
    .from(posts)
    .where(isNotNull(posts.publishedAt))
    .groupBy(posts.dataType);
}
