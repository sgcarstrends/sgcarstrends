import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sgcarstrends/ai", () => ({
  getCarsAggregatedByMonth: vi.fn(),
  getCoeForMonth: vi.fn(),
  regenerateBlogContent: vi.fn(),
}));

vi.mock("@sgcarstrends/utils", () => ({
  tokeniser: vi.fn((data) => JSON.stringify(data)),
}));

vi.mock("workflow", () => ({
  fetch: vi.fn(),
}));

vi.mock("@web/workflows/shared", () => ({
  revalidatePostsCache: vi.fn(),
}));

import {
  getCarsAggregatedByMonth,
  getCoeForMonth,
  regenerateBlogContent,
} from "@sgcarstrends/ai";
import { regeneratePostWorkflow } from "@web/workflows/regenerate-post";
import { revalidatePostsCache } from "@web/workflows/shared";

describe("regeneratePostWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should regenerate cars post successfully", async () => {
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([
      { make: "Toyota", count: 100 },
    ]);
    vi.mocked(regenerateBlogContent).mockResolvedValueOnce({
      postId: "regenerated-post-id",
      title: "Updated January 2024 Car Registrations",
      slug: "january-2024-car-registrations",
    });

    const result = await regeneratePostWorkflow({
      month: "2024-01",
      dataType: "cars",
    });

    expect(getCarsAggregatedByMonth).toHaveBeenCalledWith("2024-01");
    expect(regenerateBlogContent).toHaveBeenCalledWith({
      data: expect.any(String),
      month: "2024-01",
      dataType: "cars",
    });
    expect(revalidatePostsCache).toHaveBeenCalled();
    expect(result.message).toBe(
      "[REGENERATE] Successfully regenerated cars post for 2024-01",
    );
    expect(result.postId).toBe("regenerated-post-id");
    expect(result.title).toBe("Updated January 2024 Car Registrations");
    expect(result.slug).toBe("january-2024-car-registrations");
  });

  it("should regenerate coe post successfully", async () => {
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([
      { category: "A", premium: 100000 },
    ]);
    vi.mocked(regenerateBlogContent).mockResolvedValueOnce({
      postId: "regenerated-coe-post-id",
      title: "Updated January 2024 COE Results",
      slug: "january-2024-coe-results",
    });

    const result = await regeneratePostWorkflow({
      month: "2024-01",
      dataType: "coe",
    });

    expect(getCoeForMonth).toHaveBeenCalledWith("2024-01");
    expect(regenerateBlogContent).toHaveBeenCalledWith({
      data: expect.any(String),
      month: "2024-01",
      dataType: "coe",
    });
    expect(revalidatePostsCache).toHaveBeenCalled();
    expect(result.message).toBe(
      "[REGENERATE] Successfully regenerated coe post for 2024-01",
    );
    expect(result.postId).toBe("regenerated-coe-post-id");
  });

  it("should use cars data fetcher for cars dataType", async () => {
    vi.mocked(getCarsAggregatedByMonth).mockResolvedValueOnce([]);
    vi.mocked(regenerateBlogContent).mockResolvedValueOnce({
      postId: "id",
      title: "Title",
      slug: "slug",
    });

    await regeneratePostWorkflow({
      month: "2024-02",
      dataType: "cars",
    });

    expect(getCarsAggregatedByMonth).toHaveBeenCalledWith("2024-02");
    expect(getCoeForMonth).not.toHaveBeenCalled();
  });

  it("should use coe data fetcher for coe dataType", async () => {
    vi.mocked(getCoeForMonth).mockResolvedValueOnce([]);
    vi.mocked(regenerateBlogContent).mockResolvedValueOnce({
      postId: "id",
      title: "Title",
      slug: "slug",
    });

    await regeneratePostWorkflow({
      month: "2024-02",
      dataType: "coe",
    });

    expect(getCoeForMonth).toHaveBeenCalledWith("2024-02");
    expect(getCarsAggregatedByMonth).not.toHaveBeenCalled();
  });
});
