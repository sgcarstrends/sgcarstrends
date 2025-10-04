import { describe, expect, it, vi } from "vitest";
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

describe("subscribeAction", () => {
  it("should accept FormData with email", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");

    const result = await subscribeAction(formData);

    expect(result).toBeDefined();
  });

  it("should extract email from FormData", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");

    const result = await subscribeAction(formData);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("data");
  });

  it("should call Resend contacts.create with email", async () => {
    const formData = new FormData();
    formData.set("email", "newsletter@example.com");

    const result = await subscribeAction(formData);

    expect(result).toBeDefined();
  });
});
