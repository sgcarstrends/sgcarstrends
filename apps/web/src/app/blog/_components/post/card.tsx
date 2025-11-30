"use client";

import { CardBody, CardFooter, Card as HeroCard } from "@heroui/card";
import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import Typography from "@web/components/typography";
import Image from "next/image";
import {
  formatDate,
  getCategoryConfig,
  getExcerpt,
  getPostImage,
} from "./utils";

type Props = {
  post: SelectPost;
};

export const Card = ({ post }: Props) => {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const category = getCategoryConfig(post);
  const imageUrl = getPostImage(post, "card");
  const excerpt = getExcerpt(post);

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <HeroCard
        className="group h-full overflow-hidden border-none bg-content1 shadow-sm transition-shadow duration-300 hover:shadow-md"
        isPressable
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Cover image for ${post.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardBody className="flex flex-col gap-2 p-4">
          {/* Category & Date */}
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold text-xs uppercase tracking-wide ${category.className}`}
            >
              {category.label}
            </span>
            <span className="text-default-400">·</span>
            <Typography.Caption>{formatDate(publishedDate)}</Typography.Caption>
          </div>

          {/* Title */}
          <Typography.H3 className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
            {post.title}
          </Typography.H3>

          {/* Excerpt */}
          {excerpt && (
            <Typography.TextSm className="line-clamp-2 text-default-500">
              {excerpt}
            </Typography.TextSm>
          )}
        </CardBody>

        <CardFooter className="px-4 pt-0 pb-4">
          <span className="group/link flex items-center gap-1 font-medium text-primary text-sm transition-colors">
            Read analysis
            <span className="transition-transform duration-200 group-hover/link:translate-x-1">
              →
            </span>
          </span>
        </CardFooter>
      </HeroCard>
    </Link>
  );
};
