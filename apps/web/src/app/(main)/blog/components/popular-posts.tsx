"use client";

import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import Image from "next/image";
import { getPostImage } from "./post/utils";

interface PostWithViews extends SelectPost {
  viewCount: number;
}

interface PopularPostsProps {
  posts: PostWithViews[];
}

const formatViewCount = (count: number): string => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
};

export function PopularPosts({ posts }: PopularPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <Flame className="size-4 text-orange-500" />
        <span className="font-semibold text-default-500 text-xs uppercase tracking-widest">
          Trending
        </span>
      </motion.div>

      {/* Posts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group relative flex h-full overflow-hidden rounded-xl border border-default-200 bg-default-50 transition-all duration-300 hover:border-default-300 hover:shadow-lg"
            >
              {/* Image Section */}
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden">
                <Image
                  src={getPostImage(post, "compact")}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Rank badge overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="font-black text-2xl text-white/90">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                <span className="line-clamp-2 font-medium text-default-800 text-sm leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </span>
                <div className="flex items-center gap-2 text-default-400">
                  <TrendingUp className="size-3 text-orange-500" />
                  <span className="text-xs tabular-nums">
                    {formatViewCount(post.viewCount)} views
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
