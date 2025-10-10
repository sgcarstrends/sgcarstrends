import { describe, expect, it, vi } from "vitest";

// Mock Resend with vi.hoisted to ensure proper initialization
const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    contacts: {
      create: mockCreate,
    },
  })),
}));

import { newsletterRouter } from "../newsletter";

// Create a test caller
const createCaller = newsletterRouter.createCaller;

describe("Newsletter tRPC Router", () => {
  describe("subscribe mutation", () => {
    it("should validate email address", async () => {
      const caller = createCaller({});

      await expect(
        caller.subscribe({ email: "invalid-email" }),
      ).rejects.toThrow();
    });

    it("should throw error when RESEND_AUDIENCE_ID is missing", async () => {
      const caller = createCaller({});
      const originalAudienceId = process.env.RESEND_AUDIENCE_ID;
      delete process.env.RESEND_AUDIENCE_ID;

      await expect(
        caller.subscribe({ email: "test@example.com" }),
      ).rejects.toThrow("Newsletter service not configured");

      // Restore
      if (originalAudienceId) {
        process.env.RESEND_AUDIENCE_ID = originalAudienceId;
      }
    });

    it("should handle successful subscription", async () => {
      const caller = createCaller({});
      process.env.RESEND_AUDIENCE_ID = "test-audience-id";

      mockCreate.mockResolvedValueOnce({
        data: { id: "contact-123" },
        error: null,
      });

      const result = await caller.subscribe({ email: "test@example.com" });

      expect(result).toEqual({
        success: true,
        message: "Successfully subscribed to newsletter",
      });
      expect(mockCreate).toHaveBeenCalledWith({
        email: "test@example.com",
        audienceId: "test-audience-id",
      });
    });

    it("should handle already subscribed error", async () => {
      const caller = createCaller({});
      process.env.RESEND_AUDIENCE_ID = "test-audience-id";

      mockCreate.mockResolvedValueOnce({
        data: null,
        error: { message: "Contact already exists" },
      });

      await expect(
        caller.subscribe({ email: "existing@example.com" }),
      ).rejects.toThrow("Email already subscribed");
    });

    it("should handle Resend API errors", async () => {
      const caller = createCaller({});
      process.env.RESEND_AUDIENCE_ID = "test-audience-id";

      mockCreate.mockResolvedValueOnce({
        data: null,
        error: { message: "API error" },
      });

      await expect(
        caller.subscribe({ email: "test@example.com" }),
      ).rejects.toThrow("Failed to subscribe to newsletter");
    });

    it("should handle network errors", async () => {
      const caller = createCaller({});
      process.env.RESEND_AUDIENCE_ID = "test-audience-id";

      mockCreate.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        caller.subscribe({ email: "test@example.com" }),
      ).rejects.toThrow("Failed to subscribe to newsletter");
    });
  });
});
