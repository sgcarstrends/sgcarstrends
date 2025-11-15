import { withErrorHandling } from "@api/features/shared/error-handler";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";

describe("withErrorHandling", () => {
  const mockContext = {
    json: vi.fn((data, status) => ({
      data,
      status,
    })),
  } as unknown as Context;

  it("should return handler result when no error occurs", async () => {
    const mockResponse = { success: true } as unknown as Response;
    const handler = vi.fn().mockResolvedValue(mockResponse);

    const wrappedHandler = withErrorHandling(handler, {
      operation: "test operation",
    });

    const result = await wrappedHandler(mockContext);

    expect(result).toBe(mockResponse);
    expect(handler).toHaveBeenCalledWith(mockContext);
  });

  it("should handle errors and return error response", async () => {
    const error = new Error("Test error");
    const handler = vi.fn().mockRejectedValue(error);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const wrappedHandler = withErrorHandling(handler, {
      operation: "fetching data",
      details: { id: 123 },
    });

    await wrappedHandler(mockContext);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error in fetching data:",
      error,
      { id: 123 },
    );
    expect(mockContext.json).toHaveBeenCalledWith(
      {
        error: "An error occurred while fetching data",
        details: "Test error",
      },
      500,
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle errors without additional details", async () => {
    const error = new Error("Another test error");
    const handler = vi.fn().mockRejectedValue(error);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const wrappedHandler = withErrorHandling(handler, {
      operation: "processing request",
    });

    await wrappedHandler(mockContext);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error in processing request:",
      error,
      undefined,
    );

    consoleErrorSpy.mockRestore();
  });
});
