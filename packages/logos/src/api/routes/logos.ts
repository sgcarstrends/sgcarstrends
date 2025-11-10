import { Hono } from "hono";
import { PATH_PREFIX } from "@/config";
import {
  listAllLogos,
  removeLogoFromList,
  removeLogoMetadata,
} from "@/infra/storage/kv.service";
import { downloadLogo, getLogo, listLogos } from "@/infra/storage/r2.service";
import type { Env } from "@/types/env";
import { logError, logInfo } from "@/utils/logger";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  try {
    logInfo("Fetching logos list", {
      operation: "LOGOS_LIST",
    });

    const logos = await listLogos(c.env.CAR_LOGOS, c.env.CAR_LOGOS_METADATA);

    const responseBody = {
      success: true,
      count: logos.length,
      logos,
    };

    const response = c.json(responseBody);

    logInfo("200 OK, cached for future requests", {
      operation: "LOGOS_LIST",
      count: logos.length,
    });
    return response;
  } catch (error) {
    logError("Failed to fetch logos list", error, {
      operation: "LOGOS_LIST",
    });

    return c.json(
      {
        success: false,
        error: `Failed to fetch logos: ${(error as Error).message}`,
      },
      500,
    );
  }
});

app.get("/:brand", async (c) => {
  const start = Date.now();

  try {
    let brand = c.req.param("brand");

    if (!brand || brand.trim().length === 0) {
      logInfo("Logo request - missing brand name", {
        operation: "LOGO_REQUEST",
      });

      return c.json({ success: false, error: "Brand name is required" }, 400);
    }

    brand = brand.trim();

    logInfo("Requesting logo", {
      operation: "LOGO_REQUEST",
      brand,
    });

    const logo = await getLogo(
      c.env.CAR_LOGOS,
      c.env.CAR_LOGOS_METADATA,
      brand,
    );
    const lookupDuration = Date.now() - start;

    if (!logo) {
      logInfo("Logo not found in R2, attempting download", {
        operation: "LOGO_REQUEST",
        brand,
        duration: lookupDuration,
      });

      const downloadStart = Date.now();
      const downloadResult = await downloadLogo(
        c.env.CAR_LOGOS,
        c.env.CAR_LOGOS_METADATA,
        brand,
      );
      const downloadDuration = Date.now() - downloadStart;

      if (!downloadResult.success) {
        logError(
          "Failed to download logo",
          new Error(downloadResult.error ?? "Unknown error"),
          {
            operation: "LOGO_DOWNLOAD",
            brand,
            duration: downloadDuration,
          },
        );

        return c.json(
          {
            success: false,
            error: "Logo not found and could not be downloaded",
            details: downloadResult.error,
          },
          404,
        );
      }

      logInfo("200 OK (downloaded and cached)", {
        operation: "LOGO_REQUEST",
        brand,
      });

      return c.json({
        success: true,
        logo: downloadResult.logo,
      });
    }

    logInfo("200 OK (cached for future requests)", {
      operation: "LOGO_REQUEST",
      brand,
    });

    const response = { success: true, logo };
    console.log(response);
    return c.json(response);
  } catch (error) {
    const brand = c.req.param("brand");

    logError("Error in logo endpoint", error, {
      operation: "LOGO_REQUEST",
      brand,
    });

    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

app.post("/sync", async (c) => {
  try {
    logInfo("Starting KV-R2 synchronisation", {
      operation: "SYNC_METADATA",
    });

    const bucket = c.env.CAR_LOGOS;
    const kv = c.env.CAR_LOGOS_METADATA;

    // Get all logos from KV
    const kvLogos = await listAllLogos(kv);
    let removedCount = 0;
    let verifiedCount = 0;

    logInfo("Verifying KV metadata against R2 files", {
      operation: "SYNC_METADATA",
      kvLogoCount: kvLogos.length,
    });

    // Check each KV entry against R2
    for (const logo of kvLogos) {
      const fullPath = `${PATH_PREFIX}/${logo.filename}`;
      const r2Object = await bucket.get(fullPath);

      if (!r2Object) {
        // R2 file missing, remove from KV
        await Promise.all([
          removeLogoMetadata(kv, logo.brand),
          removeLogoFromList(kv, logo.brand),
        ]);
        removedCount++;

        logInfo("Removed stale metadata for missing R2 file", {
          operation: "SYNC_METADATA",
          brand: logo.brand,
          filename: logo.filename,
        });
      } else {
        verifiedCount++;
      }
    }

    const syncResult = {
      success: true,
      summary: {
        totalKvEntries: kvLogos.length,
        verifiedEntries: verifiedCount,
        removedEntries: removedCount,
      },
    };

    logInfo("KV-R2 synchronisation completed", {
      operation: "SYNC_METADATA",
      ...syncResult.summary,
    });

    return c.json(syncResult);
  } catch (error) {
    logError("Failed to synchronise KV-R2 metadata", error, {
      operation: "SYNC_METADATA",
    });

    return c.json(
      {
        success: false,
        error: `Synchronisation failed: ${(error as Error).message}`,
      },
      500,
    );
  }
});

export default app;
