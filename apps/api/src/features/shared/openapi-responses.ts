import { z } from "@hono/zod-openapi";
import type { ZodSchema } from "zod";

/**
 * Standard error response schema
 */
export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

/**
 * Creates standard OpenAPI response definitions
 * @param successSchema - Zod schema for successful response
 * @param successDescription - Description for successful response
 * @returns Standard 200 and 500 response definitions
 */
export const standardResponses = (
  successSchema: ZodSchema,
  successDescription = "Successful response",
) => ({
  200: {
    description: successDescription,
    content: {
      "application/json": {
        schema: successSchema,
      },
    },
  },
  500: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: errorResponseSchema,
      },
    },
  },
});

/**
 * Error-only response for routes that only return errors
 */
export const errorOnlyResponse = () => ({
  500: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: errorResponseSchema,
      },
    },
  },
});
