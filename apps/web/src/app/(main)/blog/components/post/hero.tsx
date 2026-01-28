"use client";

import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  formatDate,
  getCategoryConfig,
  getPostImage,
  getReadingTime,
  isNewPost,
} from "./utils";

interface HeroProps {
  post: SelectPost;
}

/**
 * Bloomberg-style Hero Card
 *
 * Large editorial card with text overlaid on image.
 * Used for featured/hero posts in the blog list.
 */
export function Hero({ post }: HeroProps) {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const category = getCategoryConfig(post);
  const imageUrl = getPostImage(post, "hero");
  const readingTime = getReadingTime(post);

  // Check if post is new only on client to avoid prerender issues with new Date()
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    setIsNew(isNewPost(post));
  }, [post]);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="relative aspect-[16/10] w-full overflow-hidden rounded-lg md:aspect-[21/12]">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={`Cover image for ${post.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

        {/* NEW Badge */}
        {isNew && (
          <Chip
            size="sm"
            color="warning"
            variant="shadow"
            classNames={{
              base: "absolute top-4 right-4 z-10",
              content: "font-bold text-xs tracking-wide",
            }}
          >
            NEW
          </Chip>
        )}

        {/* Content - Bottom aligned */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* Category */}
          <span className="mb-3 font-bold text-white/70 text-xs uppercase tracking-[0.2em] drop-shadow-md">
            {category.label}
          </span>

          {/* Title */}
          <h2 className="mb-3 line-clamp-3 max-w-2xl font-bold text-2xl text-white leading-tight drop-shadow-lg md:text-3xl">
            {post.title}
          </h2>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-white/70 drop-shadow-md">
            <span>{formatDate(publishedDate)}</span>
            <span className="h-1 w-1 rounded-full bg-white/50" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
