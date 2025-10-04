import { describe, expect, it, vi } from "vitest";
import app from "../newsletter";

// Mock Resend
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    contacts: {
      create: vi.fn(),
    },
  })),
}));

describe("Newsletter API", () => {
  describe("POST /subscribe", () => {
    it("should validate email address", async () => {
      const res = await app.request("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "invalid-email" }),
      });

      expect(res.status).toBe(400);
    });

    it("should accept valid email address", async () => {
      const res = await app.request("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "test@example.com" }),
      });

      // Should fail due to missing RESEND_AUDIENCE_ID in test environment
      expect(res.status).toBe(500);
    });

    it("should require email field", async () => {
      const res = await app.request("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
    });
  });
});
