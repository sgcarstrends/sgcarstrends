import { canUseWebShare, getShareUrl } from "@web/utils/share";
import { afterEach, describe, expect, it, vi } from "vitest";

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
