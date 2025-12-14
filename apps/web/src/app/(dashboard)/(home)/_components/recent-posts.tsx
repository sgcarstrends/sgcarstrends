import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import { Post } from "@web/app/blog/_components/post";
import { ArrowUpRight } from "lucide-react";

interface RecentPostsProps {
  posts: SelectPost[];
}

export const RecentPosts = ({ posts }: RecentPostsProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Posts</h2>
          <Link
            href="/blog"
            aria-label="View all blog posts"
            className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
          >
            <ArrowUpRight className="size-6" />
          </Link>
        </div>
        <p className="py-8 text-center text-default-500">
          No recent posts available.
        </p>
      </div>
    );
  }

  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Recent Posts</h2>
        <Link
          href="/blog"
          aria-label="View all blog posts"
          className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <ArrowUpRight className="size-6" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Post.Card key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
