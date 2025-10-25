import type { Platform } from "@api/types/social-media";

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export const addUTMParametersToURL = (
  baseUrl: string,
  platform: Platform,
  content?: string,
  term?: string,
): string => {
  const url = new URL(baseUrl);

  url.searchParams.set("utm_source", platform.toLowerCase());
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "blog");

  if (term) {
    url.searchParams.set("utm_term", term);
  }

  if (content) {
    url.searchParams.set("utm_content", content);
  }

  return url.toString();
};

export const createSocialShareURL = (
  baseUrl: string,
  platform: Platform,
  content?: string,
  term?: string,
): string => {
  return addUTMParametersToURL(baseUrl, platform, content, term);
};
