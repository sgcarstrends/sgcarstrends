import type { CarLogo } from "@logos/types";
import { getFileExtension } from "@logos/utils/file-utils";
import { normaliseMake } from "@logos/utils/normalise-make";
import { redis } from "@sgcarstrends/utils";
import { del, list, put } from "@vercel/blob";

const BLOB_PREFIX = "logos/";

/**
 * Upload a logo to Vercel Blob storage
 */
export const uploadLogo = async (
  make: string,
  buffer: ArrayBuffer,
  contentType: string,
): Promise<{ url: string; filename: string } | null> => {
  const normalisedMake = normaliseMake(make);
  const extension = getFileExtension(contentType);
  const filename = `${normalisedMake}.${extension}`;
  const pathname = `${BLOB_PREFIX}${filename}`;

  try {
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
      cacheControlMaxAge: 31536000, // 1 year
    });

    // Invalidate the logos cache so the new logo appears in the list
    await redis.del("logos");

    return { url: blob.url, filename };
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * List all logos from Vercel Blob storage
 * Caches the list in Redis indefinitely (invalidated on demand)
 */
export const listLogos = async (): Promise<CarLogo[]> => {
  try {
    // Try Redis cache first
    const cachedLogos = await redis.get<CarLogo[]>("logos");
    if (cachedLogos) {
      console.log("Using cached logos");
      return cachedLogos;
    }

    console.log("Using logos from Vercel Blob");

    const { blobs } = await list({ prefix: BLOB_PREFIX });

    const logos: CarLogo[] = blobs.map((blob) => {
      const filename = blob.pathname.replace(BLOB_PREFIX, "");
      const make = filename.replace(/\.[^/.]+$/, ""); // Remove extension

      return {
        make,
        filename,
        url: blob.url,
      };
    });

    // Cache in Redis indefinitely (invalidated on demand when logos change)
    await redis.set("logos", JSON.stringify(logos));

    return logos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Get a specific logo by make
 * Filters from the cached list for fast lookups
 */
export const getLogo = async (make: string) => {
  const normalisedMake = normaliseMake(make);

  try {
    // Get the full list (from cache or Vercel Blob)
    const logos = await listLogos();

    // Filter for the specific make
    const logo = logos.find(({ make }) => make === normalisedMake);
    if (logo) {
      return logo;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Delete a logo from Vercel Blob storage and clear Redis cache
 */
export const deleteLogo = async (make: string): Promise<boolean> => {
  const normalisedMake = normaliseMake(make);

  try {
    // Find the logo first to get the exact URL
    const logo = await getLogo(normalisedMake);
    if (!logo) {
      return true;
    }

    await del(logo.url);

    // Invalidate the logos cache so the deleted logo is removed from the list
    await redis.del("logos");

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};
