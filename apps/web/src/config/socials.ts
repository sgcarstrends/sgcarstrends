const BRAND_HANDLE = "motormetrics";

export const SOCIAL_HANDLE = `@${BRAND_HANDLE}`;

export const SOCIAL_URLS = {
  instagram: `https://www.instagram.com/${BRAND_HANDLE}`,
  telegram: `https://t.me/${BRAND_HANDLE}`,
  github: `https://github.com/${BRAND_HANDLE}`,
  twitter: `https://x.com/${BRAND_HANDLE}`,
} as const;

/** Instagram, Telegram, GitHub, and X. */
export const BRAND_SOCIAL_PROFILE_URLS = [
  SOCIAL_URLS.instagram,
  SOCIAL_URLS.telegram,
  SOCIAL_URLS.github,
  SOCIAL_URLS.twitter,
] as const;
