import { SITE_URL } from "@web/config";
import { advertiseNav, advertisePage, blogNav, socialLinks } from "@web/flags";
import { FLAGS_CACHE_TAG } from "@web/lib/cache-tags/flags";
import { evaluate } from "flags/next";
import { cacheLife, cacheTag } from "next/cache";

export interface ChromeFlags {
  advertisePage: boolean;
  advertiseNav: boolean;
  blogNav: boolean;
  socialLinks: boolean;
}

const DEFAULTS: ChromeFlags = {
  advertisePage: false,
  advertiseNav: false,
  blogNav: false,
  socialLinks: false,
};

/**
 * Site-wide toggles for the nav, footer and static pages, evaluated once and
 * cached.
 *
 * Called without a request, the Flags SDK reads `headers()` and `cookies()`
 * on every evaluation, which turns every route that renders the chrome into a
 * per-request function invocation. These are not per-user decisions, so this
 * hands the SDK a bare request instead, which makes it skip `next/headers`,
 * and runs inside `use cache`. The build evaluates the flags against the
 * definitions embedded in the deployment and the result stays static until
 * `FLAGS_CACHE_TAG` is revalidated or the site is redeployed.
 */
export async function getChromeFlags(): Promise<ChromeFlags> {
  "use cache";
  cacheLife("max");
  cacheTag(FLAGS_CACHE_TAG);

  try {
    return await evaluate(
      { advertisePage, advertiseNav, blogNav, socialLinks },
      new Request(SITE_URL),
    );
  } catch (error) {
    console.warn("[FLAGS] Falling back to defaults for the chrome:", error);
    return DEFAULTS;
  }
}
