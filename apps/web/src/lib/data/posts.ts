import { db, posts } from "@sgcarstrends/database";
import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllPosts() {
  "use cache";
  cacheLife("blogs");
  cacheTag("all-blogs");

  return db.query.posts.findMany({
    where: isNotNull(posts.publishedAt),
    orderBy: desc(posts.publishedAt),
  });
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheLife("blogs");
  cacheTag("blog", `blog-${slug}`);

  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), isNotNull(posts.publishedAt)),
  });
}

export async function getPostsByIds(postIds: string[]) {
  "use cache";
  cacheLife("blogs");
  cacheTag("blog", "posts-by-ids");

  if (postIds.length === 0) {
    return [];
  }

  return db.query.posts.findMany({
    where: and(inArray(posts.id, postIds), isNotNull(posts.publishedAt)),
    orderBy: desc(posts.publishedAt),
  });
}
