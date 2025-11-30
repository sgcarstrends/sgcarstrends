"use client";

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
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Recent Posts Stack */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Post.Card key={post.id} post={post} />
        ))}
      </div>
    </motion.div>
  );
};
