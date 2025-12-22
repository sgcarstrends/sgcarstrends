/**
 * Configuration for social media redirect routes with UTM tracking.
 * Each platform redirects to the official SG Cars Trends profile with
 * standardized UTM parameters for analytics tracking.
 */

export interface SocialPlatform {
  name: string;
  url: string;
  campaign: string;
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  twitter: {
    name: "Twitter",
    url: "https://twitter.com/sgcarstrends",
    campaign: "twitter_profile",
  },
  instagram: {
    name: "Instagram",
    url: "https://instagram.com/sgcarstrends",
    campaign: "instagram_profile",
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://linkedin.com/company/sgcarstrends",
    campaign: "linkedin_profile",
  },
  telegram: {
    name: "Telegram",
    url: "https://t.me/sgcarstrends",
    campaign: "telegram_profile",
  },
  github: {
    name: "GitHub",
    url: "https://github.com/sgcarstrends",
    campaign: "github_profile",
  },
} as const;

/**
 * UTM parameters applied to all social media redirects
 */
export const UTM_PARAMS = {
  source: "sgcarstrends",
  medium: "social_redirect",
} as const;

/**
 * Gets the list of valid social platform slugs for route generation
 */
export const getSocialPlatformSlugs = (): string[] => {
  return Object.keys(SOCIAL_PLATFORMS);
};

/**
 * Checks if a given slug is a valid social platform
 */
export const isValidSocialPlatform = (slug: string): boolean => {
  return slug in SOCIAL_PLATFORMS;
};
