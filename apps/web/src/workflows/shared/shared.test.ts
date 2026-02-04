import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { revalidatePostsCache } from "@web/workflows/shared";
import { revalidateTag } from "next/cache";

describe("revalidatePostsCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
