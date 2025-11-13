import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { getLogo, listLogos } from "@logos/services/blob";
import { downloadLogo } from "@logos/services/scraper";
import {
  BrandParamSchema,
  GetLogoResponseSchema,
  ListLogosResponseSchema,
  LogoNotFoundSchema,
} from "./schemas";

const app = new OpenAPIHono();

/**
 * GET /logos - List all available car brand logos
 */
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "List all car brand logos",
    description:
      "Returns a list of all available car brand logos with their public URLs. Results are cached in Redis for performance.",
    tags: ["Logos"],
    responses: {
      200: {
        description: "Successfully retrieved list of logos",
        content: {
          "application/json": {
            schema: ListLogosResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const logos = await listLogos();

      return c.json({
        success: true,
        count: logos.length,
        logos,
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error listing logos:", err);
      return c.json(
        {
          success: false,
          error: "An error occurred while listing logos",
        },
        500,
      );
    }
  },
);

/**
 * GET /logos/:brand - Get a specific car brand logo
 * Auto-downloads from external source if not found in storage
 */
app.openapi(
  createRoute({
    method: "get",
    path: "/:brand",
    summary: "Get car brand logo",
    description:
      "Returns the logo for a specific car brand. If the logo is not in storage, it will be automatically downloaded from carlogos.org and stored for future requests. Brand names are normalised to kebab-case (e.g., 'Mercedes-Benz' becomes 'mercedes-benz').",
    tags: ["Logos"],
    request: {
      params: BrandParamSchema,
    },
    responses: {
      200: {
        description: "Logo found and returned successfully",
        content: {
          "application/json": {
            schema: GetLogoResponseSchema,
          },
        },
      },
      404: {
        description: "Logo not found and could not be downloaded",
        content: {
          "application/json": {
            schema: LogoNotFoundSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const brand = c.req.param("brand");

      // Try to get existing logo first
      let logo = await getLogo(brand);

      // If not found, try to download it
      if (!logo) {
        const result = await downloadLogo(brand);

        if (!result.success || !result.logo) {
          return c.json(
            {
              success: false,
              error: result.error || "Logo not found",
              brand,
            },
            404,
          );
        }

        logo = result.logo;
      }

      return c.json({
        success: true,
        logo,
      });
    } catch (error) {
      const err = error as Error;
      const brand = c.req.param("brand");
      console.error(`Error fetching logo for ${brand}:`, err);
      return c.json(
        {
          success: false,
          error: "An error occurred while fetching logo",
          brand,
        },
        500,
      );
    }
  },
);

export const logosRoutes = app;
