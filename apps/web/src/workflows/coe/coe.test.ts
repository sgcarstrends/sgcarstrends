import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sgcarstrends/ai", () => ({
  generateBlogContent: vi.fn(),
  getCoeForMonth: vi.fn(),
}));

vi.mock("@sgcarstrends/utils", () => ({
  redis: {
    set: vi.fn(),
  },
  tokeniser: vi.fn((data) => JSON.stringify(data)),
}));

vi.mock("@web/workflows/coe/steps/process-data", () => ({
  updateCoe: vi.fn(),
}));

vi.mock("@web/queries/coe/latest-month", () => ({
  getCOELatestRecord: vi.fn(),
}));

vi.mock("@web/queries/posts", () => ({
  getExistingPostByMonth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("workflow", () => ({
  fetch: vi.fn(),
  getStepMetadata: vi.fn(() => ({ attempt: 1 })),
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "FatalError";
    }
  },
  RetryableError: class RetryableError extends Error {
    constructor(
      message: string,
      public options?: { retryAfter?: number | string },
    ) {
      super(message);
      this.name = "RetryableError";
    }
  },
}));

vi.mock("@web/workflows/shared", () => ({
  revalidatePostsCache: vi.fn(),
}));

import { generateBlogContent, getCoeForMonth } from "@sgcarstrends/ai";
import { redis } from "@sgcarstrends/utils";
import { getCOELatestRecord } from "@web/queries/coe/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { coeWorkflow } from "@web/workflows/coe";
import { updateCoe } from "@web/workflows/coe/steps/process-data";
import { revalidatePostsCache } from "@web/workflows/shared";
import { revalidateTag } from "next/cache";

describe("coeWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should return early when no records are processed", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 0,
      details: {},
    });

    const result = await coeWorkflow({});

    expect(result.message).toBe(
      "No COE records processed. Skipped publishing to social media.",
    );
    expect(getCOELatestRecord).not.toHaveBeenCalled();
  });

  it("should return message when no COE records found", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 5,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce(null);

    const result = await coeWorkflow({});

    expect(result.message).toBe("[COE] No COE records found");
  });

  it("should wait for second bidding exercise before generating post", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 1,
    });

    const result = await coeWorkflow({});

    expect(result.message).toBe(
      "[COE] Data processed. Waiting for second bidding exercise to generate post.",
    );
    expect(generateBlogContent).not.toHaveBeenCalled();
  });

  it("should skip blog generation when post already exists", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([
      { id: "existing-post-id" },
    ]);

    const result = await coeWorkflow({});

    expect(result.message).toBe(
      "[COE] Data processed. Post already exists, skipping social media.",
    );
    expect(generateBlogContent).not.toHaveBeenCalled();
  });

  it("should generate blog post when second bidding complete", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(generateBlogContent).mockResolvedValueOnce({
      postId: "new-post-id",
      title: "January 2024 COE Results",
      slug: "january-2024-coe-results",
    });

    const result = await coeWorkflow({});

    expect(revalidateTag).toHaveBeenCalledWith("coe:latest", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:previous", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:months", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:results", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:trends", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:bidding-rounds", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:month:2024-01", "max");
    expect(revalidateTag).toHaveBeenCalledWith("coe:year:2024", "max");
    expect(generateBlogContent).toHaveBeenCalled();
    expect(revalidatePostsCache).toHaveBeenCalled();
    expect(result.message).toBe(
      "[COE] Data processed and cache revalidated successfully",
    );
    expect(result.postId).toBe("new-post-id");
  });

  it("should update redis timestamp when records are processed", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 5,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-02",
      biddingNo: 1,
    });

    await coeWorkflow({});

    expect(redis.set).toHaveBeenCalledWith(
      "last_updated:coe",
      expect.any(Number),
    );
  });

  it("should throw RetryableError when AI is rate limited (429)", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("API error: 429 Too Many Requests"),
    );

    await expect(coeWorkflow({})).rejects.toThrow("AI rate limited");
  });

  it("should throw FatalError when AI authentication fails (401)", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("API error: 401 Unauthorized"),
    );

    await expect(coeWorkflow({})).rejects.toThrow("AI authentication failed");
  });

  it("should throw FatalError when AI access is forbidden (403)", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("API error: 403 Forbidden"),
    );

    await expect(coeWorkflow({})).rejects.toThrow("AI authentication failed");
  });

  it("should rethrow unknown errors from AI generation", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("Unknown AI error"),
    );

    await expect(coeWorkflow({})).rejects.toThrow("Unknown AI error");
  });

  it("should handle non-Error objects thrown from AI generation", async () => {
    vi.mocked(updateCoe).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCOELatestRecord).mockResolvedValueOnce({
      month: "2024-01",
      biddingNo: 2,
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce("string error");

    await expect(coeWorkflow({})).rejects.toBe("string error");
  });
});
