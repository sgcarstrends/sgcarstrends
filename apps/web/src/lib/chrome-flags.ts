import { createClient } from "@vercel/flags-core";
import { FLAGS_CACHE_TAG } from "@web/lib/cache-tags/flags";
import { cacheLife, cacheTag } from "next/cache";

export interface ChromeFlags {
  advertiseNav: boolean;
  blogNav: boolean;
  socialLinks: boolean;
}

const DEFAULTS: ChromeFlags = {
  advertiseNav: false,
  blogNav: false,
  socialLinks: false,
};

/**
 * Site-wide toggles for the nav and footer, evaluated once and cached.
 *
 * The `flag()` helper from `flags/next` reads request headers on every call,
 * which turns every route that renders the chrome into a per-request function
 * invocation. These three are not per-user decisions, so this reads them with
 * the core client, which needs no request, inside `use cache`. The build
 * evaluates them against the bundled definitions and the result stays static
 * until `FLAGS_CACHE_TAG` is revalidated or the site is redeployed.
 */
export async function getChromeFlags(): Promise<ChromeFlags> {
  "use cache";
  cacheLife("max");
  cacheTag(FLAGS_CACHE_TAG);

  const sdkKey = process.env.FLAGS;
  if (!sdkKey) {
    return DEFAULTS;
  }

  try {
    const client = createClient(sdkKey, { disableMetrics: true });
    await client.initialize();
    const [advertiseNav, blogNav, socialLinks] = await Promise.all([
      client.evaluate<boolean>("advertise-nav", DEFAULTS.advertiseNav),
      client.evaluate<boolean>("blog-nav", DEFAULTS.blogNav),
      client.evaluate<boolean>("social-links", DEFAULTS.socialLinks),
    ]);

    return {
      advertiseNav: advertiseNav.value ?? DEFAULTS.advertiseNav,
      blogNav: blogNav.value ?? DEFAULTS.blogNav,
      socialLinks: socialLinks.value ?? DEFAULTS.socialLinks,
    };
  } catch (error) {
    console.warn("[FLAGS] Falling back to defaults for the chrome:", error);
    return DEFAULTS;
  }
}
