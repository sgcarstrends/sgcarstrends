import {
  canUseWebShare,
  copyToClipboard,
  getShareUrl,
  triggerWebShare,
} from "@web/utils/share";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

describe("getShareUrl", () => {
  const url = "https://sgcarstrends.com/cars";
  const title = "Car Registrations";

  it("should generate correct Twitter share URL", () => {
    const result = getShareUrl({ platform: "twitter", url, title });
    expect(result).toBe(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    );
  });

  it("should generate correct LinkedIn share URL", () => {
    const result = getShareUrl({ platform: "linkedin", url, title });
    expect(result).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    );
  });

  it("should handle special characters in URL and title", () => {
    const specialUrl =
      "https://sgcarstrends.com/cars?month=2024-01&filter=test";
    const specialTitle = "Car Registrations: January 2024 & More";
    const result = getShareUrl({
      platform: "twitter",
      url: specialUrl,
      title: specialTitle,
    });
    expect(result).toContain(encodeURIComponent(specialUrl));
    expect(result).toContain(encodeURIComponent(specialTitle));
  });
});

describe("canUseWebShare", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
  });

  it("should return true when Web Share API is available", () => {
    Object.defineProperty(global, "navigator", {
      value: { share: vi.fn() },
      writable: true,
    });
    expect(canUseWebShare()).toBe(true);
  });

  it("should return false when navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
    });
    expect(canUseWebShare()).toBe(false);
  });

  it("should return false when share is not a function", () => {
    Object.defineProperty(global, "navigator", {
      value: { share: undefined },
      writable: true,
    });
    expect(canUseWebShare()).toBe(false);
  });
});

describe("copyToClipboard", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  it("should return true when clipboard write succeeds", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, "navigator", {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
    });

    const result = await copyToClipboard("https://example.com");
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith("https://example.com");
  });

  it("should return false when clipboard write fails", async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error("Failed"));
    Object.defineProperty(global, "navigator", {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
    });

    const result = await copyToClipboard("https://example.com");
    expect(result).toBe(false);
  });
});

describe("triggerWebShare", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  it("should return false when Web Share API is not available", async () => {
    Object.defineProperty(global, "navigator", {
      value: { share: undefined },
      writable: true,
    });

    const result = await triggerWebShare("https://example.com", "Test");
    expect(result).toBe(false);
  });

  it("should return true when share succeeds", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, "navigator", {
      value: { share: shareMock },
      writable: true,
    });

    const result = await triggerWebShare("https://example.com", "Test Title");
    expect(result).toBe(true);
    expect(shareMock).toHaveBeenCalledWith({
      title: "Test Title",
      url: "https://example.com",
    });
  });

  it("should return false when user cancels (AbortError)", async () => {
    const abortError = new Error("User cancelled");
    abortError.name = "AbortError";
    const shareMock = vi.fn().mockRejectedValue(abortError);
    Object.defineProperty(global, "navigator", {
      value: { share: shareMock },
      writable: true,
    });

    const result = await triggerWebShare("https://example.com", "Test");
    expect(result).toBe(false);
  });

  it("should return false and log error when share fails with non-AbortError", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Share failed");
    const shareMock = vi.fn().mockRejectedValue(error);
    Object.defineProperty(global, "navigator", {
      value: { share: shareMock },
      writable: true,
    });

    const result = await triggerWebShare("https://example.com", "Test");
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("Share failed:", error);
  });
});
