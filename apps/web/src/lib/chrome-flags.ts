import { createClient } from "@vercel/flags-core";
import { cacheLife, cacheTag } from "next/cache";

export const CHROME_FLAGS_CACHE_TAG = "chrome-flags";

export interface ChromeFlags {
  advertiseNav: boolean;
  blogNav: boolean;
  socialLinks: boolean;
}

const CHROME_FLAG_KEYS = {
  advertiseNav: "advertise-nav",
  blogNav: "blog-nav",
  socialLinks: "social-links",
} as const satisfies Record<keyof ChromeFlags, string>;

const DEFAULT_CHROME_FLAGS: ChromeFlags = {
  advertiseNav: false,
  blogNav: false,
  socialLinks: false,
};

/**
 * Nav and footer flags, evaluated once per cache window rather than per
 * request. `flag()` from `flags/next` reads headers and cookies, which makes
 * the shared layout dynamic on every page; the core client takes no request
 * context, so the chrome stays in the static shell.
 */
export async function getChromeFlags(): Promise<ChromeFlags> {
  "use cache";
  cacheLife("max");
  cacheTag(CHROME_FLAGS_CACHE_TAG);

  const sdkKey = process.env.FLAGS;
  if (!sdkKey) {
    return DEFAULT_CHROME_FLAGS;
  }

  try {
    const client = createClient(sdkKey);
    await client.initialize();
    const results = await client.bulkEvaluate<boolean>(
      Object.values(CHROME_FLAG_KEYS).map((key) => ({
        key,
        defaultValue: false,
      })),
    );

    return {
      advertiseNav:
        results[CHROME_FLAG_KEYS.advertiseNav]?.value ??
        DEFAULT_CHROME_FLAGS.advertiseNav,
      blogNav:
        results[CHROME_FLAG_KEYS.blogNav]?.value ??
        DEFAULT_CHROME_FLAGS.blogNav,
      socialLinks:
        results[CHROME_FLAG_KEYS.socialLinks]?.value ??
        DEFAULT_CHROME_FLAGS.socialLinks,
    };
  } catch (error) {
    console.error("[chrome-flags] evaluation failed, using defaults", error);
    return DEFAULT_CHROME_FLAGS;
  }
}
