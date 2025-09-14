import { db, posts } from "@sgcarstrends/database";
import { desc, eq, inArray, isNotNull } from "drizzle-orm";

export const getAllPosts = () => {
  return db.query.posts.findMany({
    where: isNotNull(posts.publishedAt),
    orderBy: desc(posts.publishedAt),
  });
};

export const getPostBySlug = (slug: string) => {
  return db.query.posts.findFirst({ where: eq(posts.slug, slug) });
};

export const getPostByIds = (postIds: string[]) => {
  if (postIds.length === 0) {
    return [];
  }

  return db.query.posts.findMany({
    where: inArray(posts.id, postIds),
    orderBy: desc(posts.publishedAt),
  });
};
