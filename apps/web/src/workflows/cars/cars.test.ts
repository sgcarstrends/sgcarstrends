import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sgcarstrends/ai", () => ({
  generateBlogContent: vi.fn(),
  getCarsAggregatedByMonth: vi.fn(),
}));

vi.mock("@sgcarstrends/utils", () => ({
  redis: {
    set: vi.fn(),
  },
  tokeniser: vi.fn((data) => JSON.stringify(data)),
}));

vi.mock("@web/workflows/cars/steps/process-data", () => ({
  updateCars: vi.fn(),
}));

vi.mock("@web/queries/cars/latest-month", () => ({
  getCarsLatestMonth: vi.fn(),
}));

vi.mock("@web/queries/posts", () => ({
  getExistingPostByMonth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
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

vi.mock("@web/lib/redis/makes", () => ({
  populateMakesSortedSet: vi.fn().mockResolvedValue(0),
}));

import {
  generateBlogContent,
  getCarsAggregatedByMonth,
} from "@sgcarstrends/ai";
import { redis } from "@sgcarstrends/utils";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { carsWorkflow } from "@web/workflows/cars";
import { updateCars } from "@web/workflows/cars/steps/process-data";
import { revalidatePostsCache } from "@web/workflows/shared";
import { revalidateTag } from "next/cache";

describe("carsWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should return early when no records are processed", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 0,
      details: {},
    });

    const result = await carsWorkflow({});

    expect(result.message).toBe(
      "No car records processed. Skipped publishing to social media.",
    );
    expect(getCarsLatestMonth).not.toHaveBeenCalled();
  });

  it("should return message when no car records found", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 5,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce(null);

    const result = await carsWorkflow({});

    expect(result.message).toBe("[CARS] No car records found");
  });

  it("should skip blog generation when post already exists", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([
      { id: "existing-post-id" },
    ]);

    const result = await carsWorkflow({});

    expect(result.message).toBe(
      "[CARS] Data processed. Post already exists, skipping social media.",
    );
    expect(generateBlogContent).not.toHaveBeenCalled();
  });

  it("should generate blog post when new data arrives", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(generateBlogContent).mockResolvedValueOnce({
      postId: "new-post-id",
      title: "January 2024 Car Registrations",
      slug: "january-2024-car-registrations",
    });

    const result = await carsWorkflow({});

    expect(revalidateTag).toHaveBeenCalledWith("cars:month:2024-01", "max");
    expect(revalidateTag).toHaveBeenCalledWith("cars:months", "max");
    expect(revalidateTag).toHaveBeenCalledWith("cars:makes", "max");
    expect(revalidateTag).toHaveBeenCalledWith("cars:annual", "max");
    expect(revalidateTag).toHaveBeenCalledWith("cars:top-makes", "max");
    expect(revalidateTag).toHaveBeenCalledWith("cars:year:2024", "max");
    expect(generateBlogContent).toHaveBeenCalled();
    expect(revalidatePostsCache).toHaveBeenCalled();
    expect(result.message).toBe(
      "[CARS] Data processed and cache revalidated successfully",
    );
    expect(result.postId).toBe("new-post-id");
  });

  it("should update redis timestamp when records are processed", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 5,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-02");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([
      { id: "existing" },
    ]);

    await carsWorkflow({});

    expect(redis.set).toHaveBeenCalledWith(
      "last_updated:cars",
      expect.any(Number),
    );
  });

  it("should throw RetryableError when AI is rate limited (429)", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("API error: 429 Too Many Requests"),
    );

    await expect(carsWorkflow({})).rejects.toThrow("AI rate limited");
  });

  it("should throw FatalError when AI authentication fails (401)", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("API error: 401 Unauthorized"),
    );

    await expect(carsWorkflow({})).rejects.toThrow("AI authentication failed");
  });

  it("should throw FatalError when AI access is forbidden (403)", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("API error: 403 Forbidden"),
    );

    await expect(carsWorkflow({})).rejects.toThrow("AI authentication failed");
  });

  it("should rethrow unknown errors from AI generation", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce(
      new Error("Unknown AI error"),
    );

    await expect(carsWorkflow({})).rejects.toThrow("Unknown AI error");
  });

  it("should use payload.month when provided and skip DB query", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([
      { id: "existing-post-id" },
    ]);

    const result = await carsWorkflow({ month: "2023-06" });

    expect(getCarsLatestMonth).not.toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith("cars:month:2023-06", "max");
    expect(result.message).toBe(
      "[CARS] Data processed. Post already exists, skipping social media.",
    );
  });

  it("should fall back to DB query when month not provided", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([
      { id: "existing-post-id" },
    ]);

    const result = await carsWorkflow({});

    expect(getCarsLatestMonth).toHaveBeenCalled();
    expect(result.message).toBe(
      "[CARS] Data processed. Post already exists, skipping social media.",
    );
  });

  it("should handle non-Error objects thrown from AI generation", async () => {
    vi.mocked(updateCars).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getCarsLatestMonth).mockResolvedValueOnce("2024-01");
    vi.mocked(getExistingPostByMonth).mockResolvedValueOnce([]);
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(generateBlogContent).mockRejectedValueOnce("string error");

    await expect(carsWorkflow({})).rejects.toBe("string error");
  });
});
