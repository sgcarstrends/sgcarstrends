"use client";

import type { SelectPost } from "@sgcarstrends/database";
import { BlogPost } from "@web/components/blog/blog-post";
import { motion } from "motion/react";

interface Props {
  posts: SelectPost[];
}

export const BlogList = ({ posts }: Props) =>
  posts.map((post, index) => (
    <motion.div
      key={post.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      <BlogPost post={post} />
    </motion.div>
  ));
