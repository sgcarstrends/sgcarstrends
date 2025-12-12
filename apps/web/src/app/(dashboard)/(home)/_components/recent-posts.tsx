import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import { Post } from "@web/app/blog/_components/post";

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
          className="font-medium text-primary text-xs hover:underline"
        >
          View all →
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
