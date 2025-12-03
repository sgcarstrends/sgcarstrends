import type { ChipProps } from "@heroui/chip";
import type { SelectPost } from "@sgcarstrends/database";
import { differenceInDays } from "date-fns";

// Unified category configuration supporting both text styling and HeroUI Chip
export const categoryConfig: Record<
  string,
  {
    label: string;
    className: string;
    color: ChipProps["color"];
  }
> = {
  coe: {
    label: "COE",
    className: "text-primary",
    color: "primary",
  },
  cars: {
    label: "Cars",
    className: "text-success",
    color: "success",
  },
  default: {
    label: "Insights",
    className: "text-secondary",
    color: "secondary",
  },
};

// Default fallback for unknown categories
export const defaultCategory = {
  label: "INSIGHTS",
  className: "text-secondary",
  color: "secondary" as ChipProps["color"],
};

// Default images by category (Singapore-focused)
// Base URLs without size parameters - getImageUrl adds ?w=X&h=Y&fit=crop as needed
export const categoryImages: Record<string, string> = {
  cars: "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c", // Singapore highway with cars
  coe: "https://images.unsplash.com/photo-1519045550819-021aa92e9312", // Marina Bay Sands beside road
  default: "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c", // Singapore highway with cars
};

// Image sizes for different contexts
export const imageSizes = {
  hero: { w: 1200, h: 800 },
  card: { w: 800, h: 500 },
  compact: { w: 96, h: 96 },
} as const;

// Get optimised image URL with size parameters
export const getImageUrl = (
  baseUrl: string,
  size: keyof typeof imageSizes = "card",
): string => {
  const { w, h } = imageSizes[size];
  return `${baseUrl}?w=${w}&h=${h}&fit=crop`;
};

// Get post image URL with fallback to category default
export const getPostImage = (
  post: SelectPost,
  size: keyof typeof imageSizes = "card",
): string => {
  // Use top-level fields (flattened schema) with category fallback
  const baseUrl =
    post.heroImage ||
    categoryImages[post.dataType ?? "default"] ||
    categoryImages.default;
  return getImageUrl(baseUrl, size);
};

// Get category configuration for a post
export const getCategoryConfig = (post: SelectPost) => {
  // Use top-level dataType field (flattened schema)
  return categoryConfig[post.dataType ?? "default"] || defaultCategory;
};

// Get reading time from post metadata with default fallback
export const getReadingTime = (post: SelectPost): number => {
  const metadata = post.metadata as Record<string, unknown>;
  return (metadata?.readingTime as number) || 5;
};

// Get excerpt from post (top-level field in flattened schema)
export const getExcerpt = (post: SelectPost): string | undefined => {
  return post.excerpt ?? undefined;
};

// Format date for display
export const formatDate = (
  date: Date,
  format: "short" | "full" = "full",
): string => {
  const options: Intl.DateTimeFormatOptions =
    format === "full"
      ? { year: "numeric", month: "short", day: "numeric" }
      : { month: "short", day: "numeric" };

  return new Date(date).toLocaleDateString("en-SG", options);
};

// Check if post is new (published within threshold days)
export const isNewPost = (post: SelectPost, daysThreshold = 14): boolean => {
  const publishedDate = post.publishedAt ?? post.createdAt;
  return differenceInDays(new Date(), publishedDate) <= daysThreshold;
};
