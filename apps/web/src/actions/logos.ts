"use server";

import { getLogo, listLogos } from "@logos/services/logo";
import type { CarLogo } from "@logos/types";

/**
 * Get a single car logo by brand name
 * @param brand - The car brand name (will be normalized automatically)
 * @returns Logo data or null if not found
 */
export const getCarLogo = async (
  brand: string,
): Promise<
  { success: true; logo: CarLogo } | { success: false; error: string }
> => {
  try {
    const logo = await getLogo(brand);

    if (!logo) {
      return {
        success: false,
        error: `Logo not found for brand: ${brand}`,
      };
    }

    return { success: true, logo };
  } catch (error) {
    console.error("[getCarLogo] Error fetching logo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch logo",
    };
  }
};

/**
 * Get all available car logos
 * @returns Array of all logos or error
 */
export const getAllCarLogos = async (): Promise<
  { success: true; logos: CarLogo[] } | { success: false; error: string }
> => {
  try {
    const logos = await listLogos();

    return { success: true, logos };
  } catch (error) {
    console.error("[getAllCarLogos] Error fetching logos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch logos",
    };
  }
};

/**
 * Create a brand-to-URL map for quick logo lookups
 * @returns Map of brand names to logo URLs
 */
export const getLogoUrlMap = async () => {
  try {
    const logos = await listLogos();
    return logos.reduce<Record<string, string>>((acc, logo) => {
      acc[logo.brand] = logo.url;
      return acc;
    }, {});
  } catch (error) {
    console.error("[getLogoUrlMap] Error creating logo map:", error);
    return {};
  }
};

// Re-export types for convenience
export type { CarLogo };
