import { z } from "@hono/zod-openapi";

// Core logo schema
export const CarLogoSchema = z
  .object({
    make: z.string().openapi({
      description: "Normalised car make name in kebab-case",
      example: "toyota",
    }),
    filename: z.string().openapi({
      description: "Logo filename with extension",
      example: "toyota.png",
    }),
    url: z.string().url().openapi({
      description: "Public URL to the logo image",
      example: "https://blob.vercel-storage.com/logos/toyota.png",
    }),
  })
  .openapi({
    description: "Car make logo information",
  });

// Path parameter schema
export const MakeParamSchema = z.object({
  make: z.string().openapi({
    description: "Car make name (will be normalised to kebab-case)",
    example: "Toyota",
    param: {
      name: "make",
      in: "path",
    },
  }),
});

// Response schemas
export const ListLogosResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: "Indicates if the request was successful",
      example: true,
    }),
    count: z.number().openapi({
      description: "Total number of logos available",
      example: 88,
    }),
    logos: z.array(CarLogoSchema).openapi({
      description: "Array of car make logos",
    }),
  })
  .openapi({
    description: "Successful response with list of all logos",
  });

export const GetLogoResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: "Indicates if the request was successful",
      example: true,
    }),
    logo: CarLogoSchema.openapi({
      description: "Car make logo information",
    }),
  })
  .openapi({
    description: "Successful response with logo details",
  });

// Error schemas
export const LogoNotFoundSchema = z
  .object({
    success: z.boolean().openapi({
      description: "Indicates if the request was successful",
      example: false,
    }),
    error: z.string().openapi({
      description: "Error message",
      example: "Logo not found",
    }),
    make: z.string().optional().openapi({
      description: "The make that was searched for",
      example: "unknown-make",
    }),
  })
  .openapi({
    description: "Logo not found response",
  });

export const ErrorResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: "Indicates if the request was successful",
      example: false,
    }),
    error: z.string().openapi({
      description: "Error message describing what went wrong",
      example: "An error occurred while fetching logo",
    }),
    details: z.string().optional().openapi({
      description: "Additional error details for debugging",
    }),
  })
  .openapi({
    description: "Error response",
  });
