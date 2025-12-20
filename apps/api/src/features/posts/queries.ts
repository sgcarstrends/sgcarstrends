import { db, posts } from "@sgcarstrends/database";
import { and, eq } from "drizzle-orm";

export const getExistingPostByMonth = async <T extends string>(
  month: string,
  dataType: T,
) =>
  db
    .select({ id: posts.id, title: posts.title, slug: posts.slug })
    .from(posts)
    .where(and(eq(posts.month, month), eq(posts.dataType, dataType)))
    .limit(1);
