import type { SelectPost } from "@sgcarstrends/database";
import { BlogListClient } from "@web/app/blog/_components/blog-list.client";
import { getPostCountsByCategory } from "@web/queries/posts";

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
