import {
  and,
  asc,
  count,
  db,
  desc,
  eq,
  gt,
  inArray,
  isNotNull,
  lt,
  max,
  posts,
} from "@sgcarstrends/database";
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

export async function getPreviousPost(publishedAt: Date) {
  "use cache";
  cacheLife("max");
  cacheTag("posts:list");

  return db.query.posts.findFirst({
    where: and(
      isNotNull(posts.publishedAt),
      lt(posts.publishedAt, publishedAt),
    ),
    orderBy: desc(posts.publishedAt),
  });
}

export async function getNextPost(publishedAt: Date) {
  "use cache";
  cacheLife("max");
  cacheTag("posts:list");

  return db.query.posts.findFirst({
    where: and(
      isNotNull(posts.publishedAt),
      gt(posts.publishedAt, publishedAt),
    ),
    orderBy: asc(posts.publishedAt),
  });
}

/**
 * Check if a post already exists for a given month and data type.
 * Used by workflows to prevent duplicate post generation.
 */
export async function getExistingPostByMonth<T extends string>(
  month: string,
  dataType: T,
) {
  return db
    .select({ id: posts.id, title: posts.title, slug: posts.slug })
    .from(posts)
    .where(and(eq(posts.month, month), eq(posts.dataType, dataType)))
    .limit(1);
}
