"use client";

import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import Image from "next/image";
import {
  formatDate,
  getCategoryConfig,
  getPostImage,
  getReadingTime,
} from "./utils";

interface CompactProps {
  post: SelectPost;
}

export function Compact({ post }: CompactProps) {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const category = getCategoryConfig(post);
  const imageUrl = getPostImage(post, "compact");
  const readingTime = getReadingTime(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-4 p-4 transition-colors hover:bg-default-100"
    >
      {/* Thumbnail */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={`Thumbnail for ${post.title}`}
          fill
          sizes="48px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="line-clamp-1 font-medium text-sm transition-colors group-hover:text-primary">
          {post.title}
        </span>
        <span className="text-default-500 text-xs">
          {formatDate(publishedDate, "short")} · {readingTime} min read
        </span>
      </div>

      {/* Category Badge */}
      <Chip
        size="sm"
        color={category.color}
        variant="flat"
        classNames={{
          base: "h-5 shrink-0",
          content: "text-[10px] font-semibold px-1",
        }}
      >
        {category.label.split(" ")[0]}
      </Chip>
    </Link>
  );
}
