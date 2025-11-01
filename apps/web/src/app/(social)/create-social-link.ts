import { SOCIAL_PLATFORMS, UTM_PARAMS } from "@web/config/social-redirects";
import { NextResponse } from "next/server";

/**
 * Factory function to create social media redirect handlers
 * Avoids code duplication across multiple static route files
 */
export const createSocialLink = (platform: keyof typeof SOCIAL_PLATFORMS) => {
  const config = SOCIAL_PLATFORMS[platform];
  const url = new URL(config.url);
  url.searchParams.set("utm_source", UTM_PARAMS.source);
  url.searchParams.set("utm_medium", UTM_PARAMS.medium);
  url.searchParams.set("utm_campaign", config.campaign);

  return NextResponse.redirect(url.toString(), 301);
};
