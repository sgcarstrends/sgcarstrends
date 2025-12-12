import { getRecentPosts } from "@web/queries/posts";
import { Suspense } from "react";
import { RecentPosts } from "./recent-posts";

async function PostsSectionContent() {
  const posts = await getRecentPosts(3);
  return <RecentPosts posts={posts} />;
}

function PostsSectionSkeleton() {
  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-6 w-28 animate-pulse rounded bg-default-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-default-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Featured Post Skeleton */}
        <div className="lg:row-span-2">
          <div className="aspect-[16/10] w-full animate-pulse rounded-lg bg-default-200" />
        </div>
        {/* Stacked Posts Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[16/10] w-full animate-pulse rounded-lg bg-default-200" />
          <div className="aspect-[16/10] w-full animate-pulse rounded-lg bg-default-200" />
        </div>
      </div>
    </div>
  );
}

export function PostsSection() {
  return (
    <Suspense fallback={<PostsSectionSkeleton />}>
      <PostsSectionContent />
    </Suspense>
  );
}
