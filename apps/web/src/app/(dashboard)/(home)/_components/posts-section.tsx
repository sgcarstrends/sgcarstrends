import { ListSkeleton } from "@web/components/shared/skeleton";
import { getRecentPosts } from "@web/queries/posts";
import { Suspense } from "react";
import { RecentPosts } from "./recent-posts";

async function PostsSectionContent() {
  const posts = await getRecentPosts(3);
  return <RecentPosts posts={posts} />;
}

export const PostsSection = () => {
  return (
    <Suspense fallback={<ListSkeleton count={3} />}>
      <PostsSectionContent />
    </Suspense>
  );
};
