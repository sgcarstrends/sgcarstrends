import { successResponse } from "@api/utils/responses";
import type { Context } from "hono";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("successResponse", () => {
  const mockJson = vi.fn();
  const mockContext = { json: mockJson } as unknown as Context;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should send a success response with default status code", () => {
    const testData = { foo: "bar" };

    successResponse(mockContext, testData);

    expect(mockJson).toHaveBeenCalledWith(
      {
        status: 200,
        timestamp: "2024-01-01T00:00:00.000Z",
        data: testData,
      },
      200,
    );
  });

  it("should send a success response with custom status code", () => {
    const testData = { foo: "bar" };

    successResponse(mockContext, testData, 201);

    expect(mockJson).toHaveBeenCalledWith(
      {
        status: 201,
        timestamp: "2024-01-01T00:00:00.000Z",
        data: testData,
      },
      201,
    );
  });
});
