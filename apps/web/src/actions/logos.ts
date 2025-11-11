"use server";

import { getLogo, listLogos } from "@logos/services/blob";
import { downloadLogo } from "@logos/services/scraper";
import type { CarLogo } from "@logos/types";
import { normaliseMake } from "@logos/utils/normalise-make";
import { redis } from "@sgcarstrends/utils";

/**
 * Get a single car logo by make
 * Implements cache-aside pattern with automatic download fallback
 *
 * @param make - The car make (will be normalized automatically)
 * @returns Logo object with actual values or empty strings if not found/download fails
 */
export const getCarLogo = async (
  make: string,
): Promise<CarLogo | undefined> => {
  try {
    const normalisedMake = normaliseMake(make);
    const cacheKey = `logo:${normalisedMake}`;

    // Check cache first
    const cachedLogo = await redis.get<CarLogo>(cacheKey);
    if (cachedLogo) {
      console.log(`Cache hit for ${normalisedMake}`);
      return cachedLogo;
    }

    // Cache miss - try to get from blob storage or download
    console.log(`Cache miss for ${normalisedMake}`);
    let logo = await getLogo(normalisedMake);

    // Auto-download if not found in blob storage
    if (!logo) {
      const downloadResult = await downloadLogo(normalisedMake);

      if (downloadResult.success && downloadResult.logo) {
        logo = downloadResult.logo;

        // Invalidate list caches since new logo was added
        await Promise.all([redis.del("logos"), redis.del("logos:map")]);
      } else {
        // Cache negative result to avoid repeated download attempts
        logo = {
          make: normalisedMake,
          filename: "",
          url: "",
        };
      }
    }

    // Cache the result (success or failure)
    await redis.set(cacheKey, JSON.stringify(logo));

    return logo;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return undefined;
  }
};

/**
 * Get all available car logos with caching
 * @returns Array of all logos or error
 */
export const getAllCarLogos = async (): Promise<
  { logos: CarLogo[] } | { error: string }
> => {
  try {
    // Check cache first
    const cachedLogos = await redis.get<CarLogo[]>("logos");
    if (cachedLogos) {
      console.log("[getAllCarLogos] Using cached logos list");
      return { logos: cachedLogos };
    }

    // Cache miss - fetch from blob storage
    console.log("[getAllCarLogos] Cache miss, fetching from blob storage");
    const logos = await listLogos();

    // Cache the result
    await redis.set("logos", JSON.stringify(logos));
    console.log("[getAllCarLogos] Cached logos list");

    return { logos };
  } catch (error) {
    console.error("[getAllCarLogos] Error fetching logos:", error);

    return {
      error: error instanceof Error ? error.message : "Failed to fetch logos",
    };
  }
};

/**
 * Create a make-to-URL map for quick logo lookups with caching
 * @returns Map of makes to logo URLs
 */
export const getLogoUrlMap = async (): Promise<Record<string, string>> => {
  try {
    const cacheKey = "logos:map";

    // Check cache first
    const cachedMap = await redis.get<Record<string, string>>(cacheKey);
    if (cachedMap) {
      console.log("[getLogoUrlMap] Using cached logo map");
      return cachedMap;
    }

    // Cache miss - fetch and build map
    console.log("[getLogoUrlMap] Cache miss, building logo map");
    const logos = await listLogos();
    const logoMap = logos.reduce<Record<string, string>>((acc, logo) => {
      acc[logo.make] = logo.url;
      return acc;
    }, {});

    // Cache the map
    await redis.set(cacheKey, JSON.stringify(logoMap));
    console.log("[getLogoUrlMap] Cached logo map");

    return logoMap;
  } catch (error) {
    console.error("[getLogoUrlMap] Error creating logo map:", error);
    return {};
  }
};
