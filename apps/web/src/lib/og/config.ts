import { DOMAIN_NAME, SITE_TITLE } from "@web/config";

/**
 * OG image configuration
 */
export const OG_CONFIG = {
  /** Standard OG image dimensions */
  width: 1200,
  height: 630,

  /** Font family (must match fonts.ts) */
  fontFamily: "Urbanist",

  /** Site name for branding */
  siteName: SITE_TITLE,

  /** Site URL for branding */
  siteUrl: DOMAIN_NAME,
} as const;

/** og:image size (1200×630) for `opengraph-image.tsx` files */
export const OG_SIZE = {
  width: OG_CONFIG.width,
  height: OG_CONFIG.height,
} as const;

/** twitter:image size (1200×600, summary_large_image) for `twitter-image.tsx` files */
export const TWITTER_SIZE = {
  width: OG_CONFIG.width,
  height: 600,
} as const;

/** Content type every image file exports */
export const OG_CONTENT_TYPE = "image/png";

/** Standard cache headers for static OG images */
export const OG_HEADERS = {
  "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
} as const;
