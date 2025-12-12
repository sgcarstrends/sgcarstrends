import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import { Post } from "@web/app/blog/_components/post";
import { ArrowUpRight } from "lucide-react";

interface RecentPostsProps {
  posts: SelectPost[];
}

export const RecentPosts = ({ posts }: RecentPostsProps) => {
  const [featuredPost, ...otherPosts] = posts;

  return (
    <div className="col-span-12 rounded-3xl bg-white p-6 md:col-span-6 lg:col-span-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Recent Posts</h2>
        <Link
          href="/blog"
          className="flex size-10 items-center justify-center rounded-full bg-default-100 text-default-500 transition-colors hover:bg-default-200"
        >
          <ArrowUpRight className="size-6" />
        </Link>
      </div>

      {/* Posts Grid - Featured + Stack */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Featured Post - Large */}
        {featuredPost && (
          <div className="lg:row-span-2">
            <Post.Card post={featuredPost} />
          </div>
        )}

        {/* Stacked Posts - Smaller */}
        <div className="flex flex-col gap-4">
          {otherPosts.map((post) => (
            <Post.Card key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
