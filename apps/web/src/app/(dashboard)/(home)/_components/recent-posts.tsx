import { Card, CardBody, CardHeader } from "@heroui/card";
import type { SelectPost } from "@sgcarstrends/database";
import Typography from "@web/components/typography";
import Link from "next/link";

interface RecentPostsProps {
  posts: SelectPost[];
}

export const RecentPosts = ({ posts }: RecentPostsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.H3>Recent Posts</Typography.H3>
        <Link href="/blog" className="text-primary hover:underline">
          <Typography.BodySmall>View all</Typography.BodySmall>
        </Link>
      </div>
      {posts.map((post) => {
        const publishedDate = post.publishedAt ?? post.createdAt;

        return (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card>
              <CardHeader>{post.title}</CardHeader>
              <CardBody>
                <Typography.Caption>
                  {new Date(publishedDate).toLocaleDateString("en-SG", {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography.Caption>
              </CardBody>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
