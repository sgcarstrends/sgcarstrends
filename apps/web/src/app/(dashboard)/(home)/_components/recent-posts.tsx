"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import { Post } from "@web/app/blog/_components/post";
import Typography from "@web/components/typography";
import { motion } from "framer-motion";

interface RecentPostsProps {
  posts: SelectPost[];
}

export const RecentPosts = ({ posts }: RecentPostsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border-none bg-content1 shadow-sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4 pb-0">
          <Typography.H3 className="text-lg">Recent Posts</Typography.H3>
          <Link
            href="/blog"
            className="group flex items-center gap-1 text-primary text-sm"
          >
            View all
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </CardHeader>

        <CardBody className="flex flex-col gap-0 p-0">
          {posts.map((post, index) => (
            <div key={post.id}>
              {index > 0 && <Divider className="my-0" />}
              <Post.Compact post={post} />
            </div>
          ))}
        </CardBody>
      </Card>
    </motion.div>
  );
};
