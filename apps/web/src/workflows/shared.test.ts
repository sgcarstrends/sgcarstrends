import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@web/config/platforms", () => ({
  socialMediaManager: {
    publishToAll: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { socialMediaManager } from "@web/config/platforms";
import { revalidateTag } from "next/cache";
import { publishToSocialMedia, revalidatePostsCache } from "./shared";

describe("shared workflow utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("publishToSocialMedia", () => {
    it("should publish to all enabled platforms with formatted message", async () => {
      vi.mocked(socialMediaManager.publishToAll).mockResolvedValueOnce({
        successCount: 3,
        errorCount: 0,
        results: [],
      });

      await publishToSocialMedia("Test Title", "https://example.com/blog/test");

      expect(socialMediaManager.publishToAll).toHaveBeenCalledWith({
        message: "📰 New Blog Post: Test Title",
        link: "https://example.com/blog/test",
      });
    });

    it("should log success and error counts after publishing", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      vi.mocked(socialMediaManager.publishToAll).mockResolvedValueOnce({
        successCount: 2,
        errorCount: 1,
        results: [],
      });

      await publishToSocialMedia("Title", "https://example.com");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Publishing to all enabled platforms",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Publishing complete: 2 successful, 1 failed",
      );

      consoleSpy.mockRestore();
    });
  });

  describe("revalidatePostsCache", () => {
    it("should revalidate posts list cache tag", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await revalidatePostsCache();

      expect(revalidateTag).toHaveBeenCalledWith("posts:list", "max");
      expect(consoleSpy).toHaveBeenCalledWith(
        "[WORKFLOW] Posts cache invalidated",
      );

      consoleSpy.mockRestore();
    });
  });
});
