import { SITE_TITLE, SITE_URL } from "@web/config";
import type { Metadata } from "next";

interface CreatePageMetadataOptions {
  title: string;
  description: string;
  canonical: string;
  images?: string | string[];
  keywords?: string[];
  includeAuthors?: boolean;
}

/**
 * Creates standardized Next.js metadata for pages with consistent
 * Open Graph, Twitter, and SEO configuration.
 *
 * @param options - Metadata configuration options
 * @returns Complete Next.js Metadata object
 *
 * @example
 * ```ts
 * export const generateMetadata = async (): Promise<Metadata> => {
 *   return createPageMetadata({
 *     title: "COE Results",
 *     description: "Latest COE bidding results",
 *     canonical: "/coe/results",
 *     images: "/api/og/coe",
 *   });
 * };
 * ```
 */
export const createPageMetadata = ({
  title,
  description,
  canonical,
  images,
  keywords,
  includeAuthors = false,
}: CreatePageMetadataOptions): Metadata => {
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };

  // Add images if provided
  if (images) {
    metadata.openGraph!.images = images;
    metadata.twitter!.images = images;
  }

  // Add keywords if provided
  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords;
  }

  // Add author information if requested
  if (includeAuthors) {
    metadata.authors = [{ name: "SG Cars Trends", url: SITE_URL }];
    metadata.creator = "SG Cars Trends";
    metadata.publisher = "SG Cars Trends";
  }

  return metadata;
};
