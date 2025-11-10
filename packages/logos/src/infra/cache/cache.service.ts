import type { Context } from "hono";
import { logError, logInfo } from "@/utils/logger";

/**
 * Generate an ETag based on content
 */
export const generateETag = (content: string): string => {
  // Simple hash for ETag generation
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`;
};

/**
 * Set cache headers for API responses
 */
export const setCacheHeaders = (
  c: Context,
  maxAge: number,
  etag?: string,
  lastModified?: Date,
): void => {
  c.header("Cache-Control", `public, max-age=${maxAge}, s-maxage=${maxAge}`);

  if (etag) {
    c.header("ETag", etag);
  }

  if (lastModified) {
    c.header("Last-Modified", lastModified.toUTCString());
  }
};

/**
 * Set immutable cache headers for assets
 */
export const setAssetCacheHeaders = (maxAge: number) => ({
  cacheControl: `public, max-age=${maxAge}, immutable`,
});

/**
 * Create a cache key for Cloudflare Cache API
 */
export const createCacheKey = (url: string): string => {
  return new URL(url).toString();
};

/**
 * Check if request has conditional headers and respond accordingly
 */
export const handleConditionalRequest = (
  c: Context,
  etag: string,
  lastModified?: Date,
): Response | null => {
  const ifNoneMatch = c.req.header("If-None-Match");
  const ifModifiedSince = c.req.header("If-Modified-Since");

  logInfo("Checking conditional headers", {
    etag,
    ifNoneMatch,
    lastModified: lastModified?.toISOString(),
    ifModifiedSince,
  });

  // Check ETag
  if (ifNoneMatch === etag) {
    logInfo("ETag match found - returning 304 Not Modified", { etag });
    return c.newResponse(null, 304);
  }

  // Check Last-Modified
  if (lastModified && ifModifiedSince) {
    const modifiedSinceDate = new Date(ifModifiedSince);
    if (lastModified <= modifiedSinceDate) {
      logInfo("Last-Modified check passed - returning 304 Not Modified", {
        lastModified: lastModified.toISOString(),
        ifModifiedSince,
      });
      return c.newResponse(null, 304);
    }
  }

  logInfo("No conditional headers matched - proceeding with fresh response");
  return null;
};

/**
 * Cache response using Cloudflare Cache API
 */
export const cacheResponse = async (
  request: Request,
  response: Response,
  maxAge: number,
): Promise<void> => {
  const startTime = Date.now();

  try {
    // Access Cloudflare's cache through global caches object
    const cache = (globalThis as unknown as { caches?: { default: Cache } })
      .caches?.default;
    if (!cache) {
      logInfo("Cloudflare cache not available, skipping cache operation");
      return;
    }

    const cacheKey = createCacheKey(request.url);
    logInfo("Caching response", {
      key: cacheKey,
      maxAge,
    });

    // Clone response and add cache headers
    const responseToCache = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
      },
    });

    await cache.put(cacheKey, responseToCache);

    const duration = Date.now() - startTime;
    logInfo("Successfully cached response", {
      key: cacheKey,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError("Failed to cache response", error, {
      duration,
    });
  }
};

/**
 * Get cached response from Cloudflare Cache API
 */
export const getCachedResponse = async (request: Request): Promise<unknown> => {
  const startTime = Date.now();

  try {
    // Access Cloudflare's cache through global caches object
    const cache = (globalThis as unknown as { caches?: { default: Cache } })
      .caches?.default;
    if (!cache) {
      logInfo("Cloudflare cache not available, skipping cache lookup");
      return null;
    }

    const cacheKey = createCacheKey(request.url);
    logInfo("Looking up cached response", { key: cacheKey });

    const cachedResponse = await cache.match(cacheKey);
    const duration = Date.now() - startTime;

    if (cachedResponse) {
      logInfo("Cache hit", { key: cacheKey, duration });
    } else {
      logInfo("Cache miss", { key: cacheKey, duration });
    }

    return cachedResponse;
  } catch (error) {
    const duration = Date.now() - startTime;
    logError("Failed to get cached response", error, {
      duration,
    });
    return null;
  }
};
