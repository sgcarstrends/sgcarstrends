import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

const { MockFatalError, MockRetryableError } = vi.hoisted(() => {
  class MockFatalError extends Error {
    name = "FatalError";
    constructor(message: string) {
      super(message);
    }
  }

  class MockRetryableError extends Error {
    name = "RetryableError";
    retryAfter?: string;
    constructor(message: string, options?: { retryAfter?: string }) {
      super(message);
      this.retryAfter = options?.retryAfter;
    }
  }

  return { MockFatalError, MockRetryableError };
});

vi.mock("workflow", () => ({
  FatalError: MockFatalError,
  RetryableError: MockRetryableError,
  getWritable: vi.fn(() => ({
    getWriter: () => ({
      write: vi.fn().mockResolvedValue(undefined),
      releaseLock: vi.fn(),
    }),
  })),
}));

import { handleAIError, revalidatePostsCache } from "@web/workflows/shared";
import { revalidateTag } from "next/cache";

describe("revalidatePostsCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should revalidate posts cache tags", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await revalidatePostsCache();

    expect(revalidateTag).toHaveBeenCalledWith("posts:list", "max");
    expect(revalidateTag).toHaveBeenCalledWith("posts:recent", "max");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[WORKFLOW] Posts cache invalidated",
    );

    consoleSpy.mockRestore();
  });
});

describe("handleAIError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw RetryableError for 429 rate limit", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = new Error("Request failed with status 429");

    expect(() => handleAIError(error)).toThrow(MockRetryableError);

    try {
      handleAIError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(MockRetryableError);
      expect((e as InstanceType<typeof MockRetryableError>).message).toBe(
        "AI rate limited",
      );
      expect((e as InstanceType<typeof MockRetryableError>).retryAfter).toBe(
        "1m",
      );
    }

    consoleSpy.mockRestore();
  });

  it("should throw FatalError for 401 auth error", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = new Error("Request failed with status 401");

    expect(() => handleAIError(error)).toThrow(MockFatalError);

    try {
      handleAIError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(MockFatalError);
      expect((e as InstanceType<typeof MockFatalError>).message).toBe(
        "AI authentication failed",
      );
    }

    consoleSpy.mockRestore();
  });

  it("should throw FatalError for 403 auth error", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = new Error("Request failed with status 403");

    expect(() => handleAIError(error)).toThrow(MockFatalError);

    try {
      handleAIError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(MockFatalError);
      expect((e as InstanceType<typeof MockFatalError>).message).toBe(
        "AI authentication failed",
      );
    }

    consoleSpy.mockRestore();
  });

  it("should rethrow other errors unchanged", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const originalError = new Error("Some other error");

    expect(() => handleAIError(originalError)).toThrow(originalError);

    consoleSpy.mockRestore();
  });

  it("should handle non-Error objects", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    expect(() => handleAIError("string error")).toThrow("string error");
    expect(() => handleAIError("error with 429")).toThrow(MockRetryableError);

    consoleSpy.mockRestore();
  });
});
