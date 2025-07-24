interface EnhancedFetchApiOptions extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

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
      Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
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

/**
 * Determine intelligent cache configuration based on URL patterns
 */
function getCacheConfigForUrl(
  url: string,
  options: { cache?: RequestCache; next?: { revalidate?: number | false; tags?: string[] } }
): Pick<RequestInit, 'cache'> & { next?: { revalidate?: number | false; tags?: string[] } } {
  const { cache, next } = options;
  
  // If cache options are explicitly provided, use them
  if (cache || next) {
    return { cache, next };
  }

  // Smart defaults based on URL patterns
  if (url.includes('/latest') || url.includes('/months/latest')) {
    // Latest data: 15-minute cache with 'latest' tag
    return {
      cache: 'force-cache',
      next: { 
        revalidate: 900, // 15 minutes
        tags: ['latest', getDataTypeFromUrl(url)]
      }
    };
  }

  if (url.match(/\/cars\/[^/]*\?month=/) || url.match(/\/coe\/[^/]*\?month=/)) {
    // Historical monthly data: 1-hour cache with date-specific tags
    const monthMatch = url.match(/month=([^&]+)/);
    const month = monthMatch?.[1];
    const dataType = getDataTypeFromUrl(url);
    
    return {
      cache: 'force-cache',
      next: {
        revalidate: 3600, // 1 hour
        tags: [dataType, ...(month ? [`${dataType}:${month}`] : [])]
      }
    };
  }

  if (url.includes('/makes') || url.includes('/months')) {
    // Reference data: 24-hour cache
    return {
      cache: 'force-cache',
      next: {
        revalidate: 86400, // 24 hours
        tags: ['reference', getDataTypeFromUrl(url)]
      }
    };
  }

  if (url.includes('/compare') || url.includes('/top-') || url.includes('/market-share')) {
    // Computed/analysis data: 30-minute cache
    return {
      cache: 'force-cache',
      next: {
        revalidate: 1800, // 30 minutes
        tags: ['analysis', getDataTypeFromUrl(url)]
      }
    };
  }

  // Default: 1-hour cache for other endpoints
  return {
    cache: 'force-cache',
    next: {
      revalidate: 3600,
      tags: [getDataTypeFromUrl(url)]
    }
  };
}

/**
 * Extract data type from URL for tagging
 */
function getDataTypeFromUrl(url: string): string {
  if (url.includes('/cars')) return 'cars';
  if (url.includes('/coe')) return 'coe';
  return 'api';
}
