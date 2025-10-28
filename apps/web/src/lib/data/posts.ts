import { db, posts } from "@sgcarstrends/database";
import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";

export const getAllPosts = () => {
  return db.query.posts.findMany({
    where: isNotNull(posts.publishedAt),
    orderBy: desc(posts.publishedAt),
  });
};

export const getPostBySlug = (slug: string) => {
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), isNotNull(posts.publishedAt)),
  });
};

export const getPostsByIds = (postIds: string[]) => {
  if (postIds.length === 0) {
    return [];
  }

  return db.query.posts.findMany({
    where: and(inArray(posts.id, postIds), isNotNull(posts.publishedAt)),
    orderBy: desc(posts.publishedAt),
  });
};
