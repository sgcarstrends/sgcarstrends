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

interface CardProps {
  post: SelectPost;
}

/**
 * Bloomberg-style Card
 *
 * Editorial card design with text overlaid on image.
 * Features dark gradient overlay and drop shadows for legibility.
 */
export function Card({ post }: CardProps) {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const category = getCategoryConfig(post);
  const imageUrl = getPostImage(post, "card");
  const readingTime = getReadingTime(post);

  // Check if post is new only on client to avoid prerender issues with new Date()
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    setIsNew(isNewPost(post));
  }, [post]);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={`Cover image for ${post.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* Category */}
          <span className="mb-2 font-bold text-[10px] text-white/70 uppercase tracking-[0.2em] drop-shadow-md">
            {category.label}
          </span>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 font-bold text-lg text-white leading-tight drop-shadow-lg">
            {post.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-white/70 text-xs drop-shadow-md">
            <span>{formatDate(publishedDate)}</span>
            <span className="h-1 w-1 rounded-full bg-white/50" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
