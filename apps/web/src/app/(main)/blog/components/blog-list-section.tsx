import { BlogList } from "@web/app/(main)/blog/components/blog-list";
import { ListSkeleton } from "@web/components/shared/skeleton";
import { getAllPosts } from "@web/queries/posts";
import { Suspense } from "react";

async function BlogListContent() {
  const posts = await getAllPosts();

  return <BlogList posts={posts} />;
}

function BlogListSkeleton() {
  return <ListSkeleton count={3} />;
}

export function BlogListSection() {
  return (
    <Suspense fallback={<BlogListSkeleton />}>
      <BlogListContent />
    </Suspense>
  );
}
