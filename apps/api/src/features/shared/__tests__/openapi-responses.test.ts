import { z } from "@hono/zod-openapi";
import { describe, expect, it } from "vitest";
import {
  errorOnlyResponse,
  errorResponseSchema,
  standardResponses,
} from "../openapi-responses";

describe("openapi-responses", () => {
  describe("errorResponseSchema", () => {
    it("should validate error response with details", () => {
      const data = {
        error: "Something went wrong",
        details: "Additional information",
      };

      const result = errorResponseSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it("should validate error response without details", () => {
      const data = {
        error: "Something went wrong",
      };

      const result = errorResponseSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it("should reject invalid error response", () => {
      const data = {
        message: "Wrong field",
      };

      const result = errorResponseSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe("standardResponses", () => {
    it("should create standard responses with custom schema", () => {
      const successSchema = z.object({
        id: z.number(),
        name: z.string(),
      });

      const responses = standardResponses(successSchema, "User data retrieved");

      expect(responses).toHaveProperty("200");
      expect(responses).toHaveProperty("500");
      expect(responses[200].description).toBe("User data retrieved");
      expect(responses[500].description).toBe("Internal server error");
    });

    it("should use default description when not provided", () => {
      const successSchema = z.string();

      const responses = standardResponses(successSchema);

      expect(responses[200].description).toBe("Successful response");
    });

    it("should include proper content types", () => {
      const successSchema = z.array(z.string());

      const responses = standardResponses(successSchema);

      expect(responses[200].content).toHaveProperty("application/json");
      expect(responses[500].content).toHaveProperty("application/json");
    });
  });

  describe("errorOnlyResponse", () => {
    it("should create error-only response", () => {
      const response = errorOnlyResponse();

      expect(response).toHaveProperty("500");
      expect(response[500].description).toBe("Internal server error");
      expect(response[500].content).toHaveProperty("application/json");
    });
  });
});
