import { Resource } from "sst";

interface EnhancedFetchApiOptions extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

// Simple cache configuration - 1 day for all endpoints
export const CACHE_DURATION = 86400; // 24 hours

/**
 * Extract data type from URL for tagging
 */
const getDataTypeFromUrl = (url: string): string => {
  if (url.includes("/cars")) return "cars";
  if (url.includes("/coe")) return "coe";
  return "api";
};

/**
 * Determine intelligent cache configuration based on URL patterns
 */
const getCacheConfigForUrl = (
  url: string,
  options: {
    cache?: RequestCache;
    next?: { revalidate?: number | false; tags?: string[] };
  },
): Pick<RequestInit, "cache"> & {
  next?: { revalidate?: number | false; tags?: string[] };
} => {
  const { cache, next } = options;

  // If cache options are explicitly provided, use them
  if (cache || next) {
    return { cache, next };
  }

  const dataType = getDataTypeFromUrl(url);

  // Simple configuration: 1 day cache for all endpoints
  return {
    cache: "force-cache" as const,
    next: {
      revalidate: CACHE_DURATION,
      tags: [dataType],
    },
  };
};

/**
 * Enhanced fetchApi utility with Next.js caching support
 * @param url - The URL to fetch
 * @param options - Fetch options including Next.js cache options
 * @returns Promise resolving to the parsed JSON response
 */
export const fetchApi = async <T>(
  url: string,
  options: EnhancedFetchApiOptions = {},
): Promise<T> => {
  const { cache, next, ...restOptions } = options;

  // Smart cache defaults based on URL patterns
  const cacheConfig = getCacheConfigForUrl(url, { cache, next });

  const response = await fetch(url, {
    ...restOptions,
    ...cacheConfig,
    headers: {
      Authorization: `Bearer ${Resource.SG_CARS_TRENDS_API_TOKEN.value}`,
      ...restOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API call failed: ${url} - ${response.status} - ${response.statusText}`,
    );
  }

  return response.json();
};
