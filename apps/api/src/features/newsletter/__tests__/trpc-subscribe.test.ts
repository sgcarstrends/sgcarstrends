import { newsletterRouter } from "@api/trpc/newsletter/router";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

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

// Create a test caller
const createCaller = newsletterRouter.createCaller;
const TEST_AUDIENCE_ID = "test-audience-id";
const originalAudienceId = process.env.RESEND_AUDIENCE_ID;

const setAudienceId = (audienceId?: string) => {
  if (audienceId === undefined) {
    delete process.env.RESEND_AUDIENCE_ID;
    return;
  }

  process.env.RESEND_AUDIENCE_ID = audienceId;
};

const callSubscribe = (email: string) => createCaller({}).subscribe({ email });

beforeEach(() => {
  mockCreate.mockReset();
  setAudienceId(originalAudienceId);
});

afterAll(() => {
  setAudienceId(originalAudienceId);
});

describe("Newsletter tRPC Router", () => {
  describe("subscribe mutation", () => {
    it("should validate email address", async () => {
      await expect(callSubscribe("invalid-email")).rejects.toThrow();
    });

    it("should throw error when RESEND_AUDIENCE_ID is missing", async () => {
      setAudienceId(undefined);

      await expect(callSubscribe("test@example.com")).rejects.toThrow(
        "Newsletter service not configured",
      );
    });

    describe("when Resend audience is configured", () => {
      beforeEach(() => {
        setAudienceId(TEST_AUDIENCE_ID);
      });

      it("should handle successful subscription", async () => {
        mockCreate.mockResolvedValueOnce({
          data: { id: "contact-123" },
          error: null,
        });

        const result = await callSubscribe("test@example.com");

        expect(result).toEqual({
          success: true,
          message: "Successfully subscribed to newsletter",
        });
        expect(mockCreate).toHaveBeenCalledWith({
          email: "test@example.com",
          audienceId: TEST_AUDIENCE_ID,
        });
      });

      it("should handle already subscribed error", async () => {
        mockCreate.mockResolvedValueOnce({
          data: null,
          error: { message: "Contact already exists" },
        });

        await expect(callSubscribe("existing@example.com")).rejects.toThrow(
          "Email already subscribed",
        );
      });

      it("should handle Resend API errors", async () => {
        mockCreate.mockResolvedValueOnce({
          data: null,
          error: { message: "API error" },
        });

        await expect(callSubscribe("test@example.com")).rejects.toThrow(
          "Failed to subscribe to newsletter",
        );
      });

      it("should handle network errors", async () => {
        mockCreate.mockRejectedValueOnce(new Error("Network error"));

        await expect(callSubscribe("test@example.com")).rejects.toThrow(
          "Failed to subscribe to newsletter",
        );
      });
    });
  });
});
