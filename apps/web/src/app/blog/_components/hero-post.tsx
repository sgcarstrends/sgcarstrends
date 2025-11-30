"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip, type ChipProps } from "@heroui/chip";
import { Link } from "@heroui/link";
import type { SelectPost } from "@sgcarstrends/database";
import Typography from "@web/components/typography";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  post: SelectPost;
};

// Category configuration for labels and colors
const categoryConfig: Record<
  string,
  { label: string; color: ChipProps["color"] }
> = {
  coe: { label: "COE ANALYSIS", color: "primary" },
  cars: { label: "EV MARKET", color: "success" },
};

// Default images by category (generic, no brand logos)
// Images from Unsplash - Singapore traffic and EV charging themes
const categoryImages: Record<string, string> = {
  coe: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=800&fit=crop", // Singapore Marina Bay skyline
  cars: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop", // EV charging cable/plug
  default:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop", // Car on road
};

const getPostImage = (post: SelectPost): string => {
  const metadata = post.metadata as any;
  if (metadata?.image) return metadata.image;
  return categoryImages[metadata?.dataType] || categoryImages.default;
};

const getCategoryConfig = (post: SelectPost) => {
  const metadata = post.metadata as any;
  const dataType = metadata?.dataType || "default";
  return (
    categoryConfig[dataType] || {
      label: "INSIGHTS",
      color: "secondary",
    }
  );
};

export const HeroPost = ({ post }: Props) => {
  const metadata = post.metadata as any;
  const publishedDate = post.publishedAt ?? post.createdAt;
  const category = getCategoryConfig(post);
  const imageUrl = getPostImage(post);
  const readingTime = metadata?.readingTime || 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <Card
          className="group overflow-hidden border-none bg-content1 shadow-sm transition-shadow duration-300 hover:shadow-lg"
          isPressable
        >
          <CardBody className="p-0">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Image Section */}
              <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:w-1/2">
                <Image
                  src={imageUrl}
                  alt={`Cover image for ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:py-8 md:pr-8 md:pl-0">
                {/* Category & Date */}
                <div className="flex items-center gap-3">
                  <Chip
                    size="sm"
                    color={category.color}
                    variant="flat"
                    classNames={{
                      base: "h-6",
                      content: "text-xs font-semibold tracking-wide",
                    }}
                  >
                    {category.label}
                  </Chip>
                  <Typography.Caption>
                    {new Date(publishedDate).toLocaleDateString("en-SG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography.Caption>
                </div>

                {/* Title */}
                <Typography.H2 className="line-clamp-3 transition-colors group-hover:text-primary">
                  {post.title}
                </Typography.H2>

                {/* Excerpt */}
                {metadata?.excerpt && (
                  <Typography.Text className="line-clamp-3 text-default-600">
                    {metadata.excerpt}
                  </Typography.Text>
                )}

                {/* Reading Time */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Typography.TextSm className="text-default-500">
                    {readingTime} min read
                  </Typography.TextSm>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
};
