import { verifyTurnstileToken } from "@web/utils/turnstile";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("verifyTurnstileToken", () => {
  const mockToken = "test-token-123";
  const mockSecretKey = "test-secret-key";

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.TURNSTILE_SECRET_KEY = mockSecretKey;
  });

  it("should successfully verify a valid token", async () => {
    const mockResponse = {
      success: true,
      challenge_ts: "2025-01-01T00:00:00.000Z",
      hostname: "localhost",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await verifyTurnstileToken(mockToken);

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: mockSecretKey,
          response: mockToken,
        }),
      },
    );
  });

  it("should return failure when verification fails", async () => {
    const mockResponse = {
      success: false,
      "error-codes": ["invalid-input-response"],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await verifyTurnstileToken(mockToken);

    expect(result.success).toBe(false);
    expect(result["error-codes"]).toContain("invalid-input-response");
  });

  it("should throw error when TURNSTILE_SECRET_KEY is not configured", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;

    await expect(verifyTurnstileToken(mockToken)).rejects.toThrow(
      "TURNSTILE_SECRET_KEY is not configured",
    );
  });

  it("should throw error when fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(verifyTurnstileToken(mockToken)).rejects.toThrow(
      "Turnstile verification failed with status: 500",
    );
  });

  it("should throw error when response format is invalid", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: "response" }),
    });

    await expect(verifyTurnstileToken(mockToken)).rejects.toThrow(
      "Invalid Turnstile response format",
    );
  });

  it("should handle network errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(verifyTurnstileToken(mockToken)).rejects.toThrow(
      "Network error",
    );
  });
});
