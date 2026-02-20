"use client";

import type { SelectPost } from "@sgcarstrends/database";
import Link from "next/link";
import { Cover } from "./cover";
import { formatDate, getExcerpt, getReadingTime } from "./utils";

interface HeroProps {
  post: SelectPost;
}

/**
 * Featured blog post — horizontal layout.
 * Cover image on the left, text on the right.
 */
export function Hero({ post }: HeroProps) {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const readingTime = getReadingTime(post);
  const excerpt = getExcerpt(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-6 md:grid-cols-5"
    >
      <Cover
        category={post.dataType ?? "default"}
        title={post.title}
        className="aspect-[2/1] rounded-xl md:col-span-3"
      />
      <div className="flex flex-col justify-center gap-4 md:col-span-2">
        <div className="flex items-center gap-2 text-default-400 text-sm">
          <span>{formatDate(publishedDate)}</span>
          <span className="size-1 rounded-full bg-default-300" />
          <span>{readingTime} min read</span>
        </div>
        <h2 className="line-clamp-3 font-bold text-2xl leading-tight transition-colors group-hover:text-primary md:text-3xl">
          {post.title}
        </h2>
        {excerpt && (
          <p className="line-clamp-3 text-base text-default-500 leading-relaxed">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
