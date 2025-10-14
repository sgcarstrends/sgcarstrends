import { beforeEach, describe, expect, it, vi } from "vitest";
import { subscribeAction } from "../subscribe-action";

// Mock Resend
vi.mock("@web/utils/resend", () => ({
  resend: {
    contacts: {
      create: vi.fn().mockResolvedValue({
        data: { id: "test-id" },
        error: null,
      }),
    },
  },
}));

// Mock Turnstile verification
vi.mock("@web/utils/turnstile", () => ({
  verifyTurnstileToken: vi.fn().mockResolvedValue({
    success: true,
    challenge_ts: "2025-01-01T00:00:00.000Z",
    hostname: "localhost",
  }),
}));

describe("subscribeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when turnstile token is missing", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    // No cf-turnstile-response token

    const result = await subscribeAction(formData);

    expect(result).toEqual({
      data: null,
      error: { message: "Please complete the verification" },
    });
  });

  it("should verify turnstile token before subscription", async () => {
    const { verifyTurnstileToken } = await import("@web/utils/turnstile");

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("cf-turnstile-response", "valid-token");

    await subscribeAction(formData);

    expect(verifyTurnstileToken).toHaveBeenCalledWith("valid-token");
  });

  it("should return error when turnstile verification fails", async () => {
    const { verifyTurnstileToken } = await import("@web/utils/turnstile");
    vi.mocked(verifyTurnstileToken).mockResolvedValue({
      success: false,
      "error-codes": ["invalid-input-response"],
    });

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("cf-turnstile-response", "invalid-token");

    const result = await subscribeAction(formData);

    expect(result).toEqual({
      data: null,
      error: { message: "Verification failed. Please try again." },
    });
  });

  it("should handle turnstile verification errors", async () => {
    const { verifyTurnstileToken } = await import("@web/utils/turnstile");
    vi.mocked(verifyTurnstileToken).mockRejectedValue(
      new Error("Network error"),
    );

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("cf-turnstile-response", "error-token");

    const result = await subscribeAction(formData);

    expect(result).toEqual({
      data: null,
      error: { message: "Verification error. Please try again." },
    });
  });

  it("should subscribe user after successful verification", async () => {
    const { verifyTurnstileToken } = await import("@web/utils/turnstile");
    const { resend } = await import("@web/utils/resend");

    // Reset to default successful verification
    vi.mocked(verifyTurnstileToken).mockResolvedValue({
      success: true,
      challenge_ts: "2025-01-01T00:00:00.000Z",
      hostname: "localhost",
    });

    const formData = new FormData();
    formData.set("email", "newsletter@example.com");
    formData.set("cf-turnstile-response", "valid-token");

    const result = await subscribeAction(formData);

    expect(result).toHaveProperty("data");
    expect(resend.contacts.create).toHaveBeenCalledWith({
      email: "newsletter@example.com",
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
  });
});
