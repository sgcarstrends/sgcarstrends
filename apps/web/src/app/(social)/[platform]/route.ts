import {
  isValidSocialPlatform,
  SOCIAL_PLATFORMS,
  UTM_PARAMS,
} from "@web/config/social-redirects";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Generate static params for all supported social platforms
 * This enables static generation of redirect routes at build time
 */
export const generateStaticParams = () => {
  return Object.keys(SOCIAL_PLATFORMS).map((platform) => ({
    platform,
  }));
};

export const GET = async (
  _req: NextRequest,
  ctx: RouteContext<"/[platform]">,
) => {
  const { platform } = await ctx.params;

  // Validate platform exists in configuration
  if (!isValidSocialPlatform(platform)) {
    return NextResponse.json(
      { error: "Invalid social platform" },
      { status: 404 },
    );
  }

  const config = SOCIAL_PLATFORMS[platform];
  const url = new URL(config.url);

  // Add UTM parameters for analytics tracking
  url.searchParams.set("utm_source", UTM_PARAMS.source);
  url.searchParams.set("utm_medium", UTM_PARAMS.medium);
  url.searchParams.set("utm_campaign", config.campaign);

  return NextResponse.redirect(url.toString(), 301);
};
