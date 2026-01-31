import { describe, expect, it, vi } from "vitest";
import { postTweet } from "./twitter";

describe("postTweet", () => {
  it("should log the message", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await postTweet("Test tweet message");

    expect(consoleSpy).toHaveBeenCalledWith({ message: "Test tweet message" });
    expect(consoleSpy).toHaveBeenCalledWith("TEST");

    consoleSpy.mockRestore();
  });

  it("should throw error with message when posting fails", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock console.log to throw on the second call (the "TEST" log)
    let callCount = 0;
    logSpy.mockImplementation(() => {
      callCount++;
      if (callCount === 2) {
        throw new Error("Network error");
      }
    });

    await expect(postTweet("Test message")).rejects.toThrow(
      "Failed to post tweet: Network error",
    );

    expect(errorSpy).toHaveBeenCalledWith(
      "Error posting tweet:",
      expect.any(Error),
    );

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("should handle non-Error thrown values", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    let callCount = 0;
    logSpy.mockImplementation(() => {
      callCount++;
      if (callCount === 2) {
        throw "String error";
      }
    });

    await expect(postTweet("Test message")).rejects.toThrow(
      "Failed to post tweet: String error",
    );

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
