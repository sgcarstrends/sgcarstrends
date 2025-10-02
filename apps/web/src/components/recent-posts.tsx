import { Card, CardBody, CardHeader } from "@heroui/card";
import type { SelectPost } from "@sgcarstrends/database";
import Link from "next/link";

interface RecentPostsProps {
  posts: SelectPost[];
}

export const RecentPosts = ({ posts }: RecentPostsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Recent Posts</h3>
        <Link href="/blog" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      {posts.map((post) => {
        const publishedDate = post.publishedAt ?? post.createdAt;

        return (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card>
              <CardHeader>{post.title}</CardHeader>
              <CardBody>
                <span className="text-default-500 text-xs">
                  {new Date(publishedDate).toLocaleDateString("en-SG", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </CardBody>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
