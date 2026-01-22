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
});
