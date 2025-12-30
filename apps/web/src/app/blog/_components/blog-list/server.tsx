import type { SelectPost } from "@sgcarstrends/database";
import { getPostCountsByCategory } from "@web/queries/posts";
import { BlogListClient } from "./client";

interface Props {
  posts: SelectPost[];
}

export async function BlogList({ posts }: Props) {
  const postCounts = await getPostCountsByCategory();

  const counts = {
    total: postCounts.reduce((sum, row) => sum + Number(row.count), 0),
    category: Object.fromEntries(
      postCounts
        .filter((row) => row.category)
        .map((row) => [row.category, Number(row.count)]),
    ),
  };

  return <BlogListClient posts={posts} counts={counts} />;
}
