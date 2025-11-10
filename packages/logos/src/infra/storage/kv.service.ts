import type { CarLogo, LogoMetadata } from "@/types";
import { logError, logInfo } from "@/utils/logger";
import { normaliseBrandName } from "@/utils/normalisation";

const LOGOS_LIST_KEY = "logos:all";

export const getLogoMetadata = async (
  kv: KVNamespace,
  brand: string,
): Promise<LogoMetadata | null> => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);
  const key = `logo:${normalisedBrand}`;

  try {
    logInfo("Fetching logo metadata from KV", {
      brand: normalisedBrand,
      key,
    });

    const metadata = await kv.get(key, "json");
    const duration = Date.now() - start;

    if (!metadata) {
      logInfo("No metadata found in KV", {
        brand: normalisedBrand,
        duration,
      });
      return null;
    }

    logInfo("Found metadata in KV", {
      brand: normalisedBrand,
      duration,
    });

    return metadata as LogoMetadata;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to fetch logo metadata from KV", error, {
      brand: normalisedBrand,
      key,
      duration,
    });
    return null;
  }
};

export const setLogoMetadata = async (
  kv: KVNamespace,
  brand: string,
  metadata: LogoMetadata,
): Promise<boolean> => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);
  const key = `logo:${normalisedBrand}`;

  try {
    logInfo("Storing logo metadata in KV", {
      brand: normalisedBrand,
      key,
      filename: metadata.filename,
    });

    await kv.put(key, JSON.stringify(metadata));
    const duration = Date.now() - start;

    logInfo("Successfully stored metadata in KV", {
      brand: normalisedBrand,
      duration,
    });

    return true;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to store logo metadata in KV", error, {
      brand: normalisedBrand,
      key,
      duration,
    });
    return false;
  }
};

export const listAllLogos = async (
  kv: KVNamespace,
): Promise<Array<CarLogo & { url: string }>> => {
  const start = Date.now();

  try {
    logInfo("Fetching all logos from KV", {
      key: LOGOS_LIST_KEY,
    });

    const logosList = await kv.get(LOGOS_LIST_KEY, "json");
    const duration = Date.now() - start;

    if (!logosList) {
      logInfo("No logos list found in KV", {
        duration,
      });
      return [];
    }

    const logos = logosList as Array<CarLogo & { url: string }>;
    logInfo("Found logos list in KV", {
      count: logos.length,
      duration,
    });

    return logos;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to fetch logos list from KV", error, {
      key: LOGOS_LIST_KEY,
      duration,
    });
    return [];
  }
};

export const updateLogosList = async (
  kv: KVNamespace,
  logos: Array<CarLogo & { url: string }>,
): Promise<boolean> => {
  const start = Date.now();

  try {
    logInfo("Updating logos list in KV", {
      key: LOGOS_LIST_KEY,
      count: logos.length,
    });

    await kv.put(LOGOS_LIST_KEY, JSON.stringify(logos));
    const duration = Date.now() - start;

    logInfo("Successfully updated logos list in KV", {
      count: logos.length,
      duration,
    });

    return true;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to update logos list in KV", error, {
      key: LOGOS_LIST_KEY,
      count: logos.length,
      duration,
    });
    return false;
  }
};

export const addLogoToList = async (
  kv: KVNamespace,
  newLogo: CarLogo & { url: string },
): Promise<boolean> => {
  const start = Date.now();

  try {
    logInfo("Adding logo to list in KV", {
      brand: newLogo.brand,
    });

    const existingLogos = await listAllLogos(kv);
    const logoExists = existingLogos.some(
      (logo) => logo.brand === newLogo.brand,
    );

    if (logoExists) {
      logInfo("Logo already exists in list", {
        brand: newLogo.brand,
      });
      return true;
    }

    const updatedLogos = [...existingLogos, newLogo];
    const success = await updateLogosList(kv, updatedLogos);
    const duration = Date.now() - start;

    if (success) {
      logInfo("Successfully added logo to list", {
        brand: newLogo.brand,
        totalCount: updatedLogos.length,
        duration,
      });
    }

    return success;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to add logo to list in KV", error, {
      brand: newLogo.brand,
      duration,
    });
    return false;
  }
};

export const removeLogoMetadata = async (
  kv: KVNamespace,
  brand: string,
): Promise<boolean> => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);
  const key = `logo:${normalisedBrand}`;

  try {
    logInfo("Removing stale logo metadata from KV", {
      brand: normalisedBrand,
      key,
    });

    await kv.delete(key);
    const duration = Date.now() - start;

    logInfo("Successfully removed stale metadata from KV", {
      brand: normalisedBrand,
      duration,
    });

    return true;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to remove stale metadata from KV", error, {
      brand: normalisedBrand,
      key,
      duration,
    });
    return false;
  }
};

export const removeLogoFromList = async (
  kv: KVNamespace,
  brand: string,
): Promise<boolean> => {
  const start = Date.now();
  const normalisedBrand = normaliseBrandName(brand);

  try {
    logInfo("Removing logo from list in KV", {
      brand: normalisedBrand,
    });

    const existingLogos = await listAllLogos(kv);
    const updatedLogos = existingLogos.filter(
      (logo) => logo.brand !== normalisedBrand,
    );

    if (existingLogos.length === updatedLogos.length) {
      logInfo("Logo not found in list, nothing to remove", {
        brand: normalisedBrand,
      });
      return true;
    }

    const success = await updateLogosList(kv, updatedLogos);
    const duration = Date.now() - start;

    if (success) {
      logInfo("Successfully removed logo from list", {
        brand: normalisedBrand,
        removedCount: existingLogos.length - updatedLogos.length,
        totalCount: updatedLogos.length,
        duration,
      });
    }

    return success;
  } catch (error) {
    const duration = Date.now() - start;
    logError("Failed to remove logo from list in KV", error, {
      brand: normalisedBrand,
      duration,
    });
    return false;
  }
};
