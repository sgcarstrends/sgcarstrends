import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sgcarstrends/utils", () => ({
  redis: {
    set: vi.fn(),
  },
}));

vi.mock("workflow", () => ({
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

vi.mock("@web/workflows/deregistrations/steps/process-data", () => ({
  updateDeregistration: vi.fn(),
}));

vi.mock("@web/queries/deregistrations/latest-month", () => ({
  getDeregistrationsLatestMonth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { redis } from "@sgcarstrends/utils";
import { getDeregistrationsLatestMonth } from "@web/queries/deregistrations/latest-month";
import { deregistrationsWorkflow } from "@web/workflows/deregistrations";
import { updateDeregistration } from "@web/workflows/deregistrations/steps/process-data";
import { revalidateTag } from "next/cache";

describe("deregistrationsWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should return early when no records are processed", async () => {
    vi.mocked(updateDeregistration).mockResolvedValueOnce({
      recordsProcessed: 0,
      details: {},
    });

    const result = await deregistrationsWorkflow({});

    expect(result.message).toBe("No deregistration records processed.");
    expect(getDeregistrationsLatestMonth).not.toHaveBeenCalled();
  });

  it("should return message when no deregistration data found", async () => {
    vi.mocked(updateDeregistration).mockResolvedValueOnce({
      recordsProcessed: 5,
      details: {},
    });
    vi.mocked(getDeregistrationsLatestMonth).mockResolvedValueOnce({
      month: null,
    });

    const result = await deregistrationsWorkflow({});

    expect(result.message).toBe("No deregistration data found.");
  });

  it("should process data and revalidate cache on success", async () => {
    vi.mocked(updateDeregistration).mockResolvedValueOnce({
      recordsProcessed: 10,
      details: {},
    });
    vi.mocked(getDeregistrationsLatestMonth).mockResolvedValueOnce({
      month: "2024-01",
    });

    const result = await deregistrationsWorkflow({});

    expect(redis.set).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith(
      "deregistrations:month:2024-01",
      "max",
    );
    expect(revalidateTag).toHaveBeenCalledWith("deregistrations:months", "max");
    expect(revalidateTag).toHaveBeenCalledWith(
      "deregistrations:year:2024",
      "max",
    );
    expect(result.message).toBe(
      "[DEREGISTRATIONS] Data processed and cache revalidated successfully",
    );
  });

  it("should update redis timestamp when records are processed", async () => {
    vi.mocked(updateDeregistration).mockResolvedValueOnce({
      recordsProcessed: 5,
      details: {},
    });
    vi.mocked(getDeregistrationsLatestMonth).mockResolvedValueOnce({
      month: "2024-02",
    });

    await deregistrationsWorkflow({});

    expect(redis.set).toHaveBeenCalledWith(
      "last_updated:deregistrations",
      expect.any(Number),
    );
  });
});
