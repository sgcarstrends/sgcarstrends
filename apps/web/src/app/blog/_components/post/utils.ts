import type { ChipProps } from "@heroui/chip";
import type { SelectPost } from "@sgcarstrends/database";

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
    label: "COE TRENDS",
    className: "text-primary",
    color: "primary",
  },
  cars: {
    label: "EV MARKET",
    className: "text-success",
    color: "success",
  },
};

// Default fallback for unknown categories
export const defaultCategory = {
  label: "INSIGHTS",
  className: "text-secondary",
  color: "secondary" as ChipProps["color"],
};

// Default images by category (generic, no brand logos)
// Base URLs without size parameters - append ?w=X&h=Y&fit=crop as needed
export const categoryImages: Record<string, string> = {
  coe: "https://images.unsplash.com/photo-1565967511849-76a60a516170", // Singapore Marina Bay skyline
  cars: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", // EV charging cable/plug
  default: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8", // Car on road
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
  const metadata = post.metadata as Record<string, unknown>;
  // Check for heroImage first (new editorial layout), then image, then category default
  const heroImage = metadata?.heroImage as string | undefined;
  const customImage = metadata?.image as string | undefined;
  const dataType = (metadata?.dataType as string) || "default";

  const baseUrl =
    heroImage ||
    customImage ||
    categoryImages[dataType] ||
    categoryImages.default;
  return getImageUrl(baseUrl, size);
};

// Get category configuration for a post
export const getCategoryConfig = (post: SelectPost) => {
  const metadata = post.metadata as Record<string, unknown>;
  const dataType = (metadata?.dataType as string) || "default";
  return categoryConfig[dataType] || defaultCategory;
};

// Get reading time from post metadata with default fallback
export const getReadingTime = (post: SelectPost): number => {
  const metadata = post.metadata as Record<string, unknown>;
  return (metadata?.readingTime as number) || 5;
};

// Get excerpt from post metadata
export const getExcerpt = (post: SelectPost): string | undefined => {
  const metadata = post.metadata as Record<string, unknown>;
  return metadata?.excerpt as string | undefined;
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
