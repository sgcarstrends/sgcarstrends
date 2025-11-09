import { DiscordHandler } from "@api/lib/social/discord/discord-handler";
import { Platform } from "@api/types/social-media";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("DiscordHandler", () => {
  let discordHandler: DiscordHandler;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.DISCORD_WEBHOOK_URL =
      "https://discord.com/api/webhooks/123/abc";
    discordHandler = new DiscordHandler();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("configuration", () => {
    it("should have correct platform and configuration", () => {
      expect(discordHandler.platform).toBe(Platform.Discord);
      expect(discordHandler.config.enabled).toBe(true);
      expect(discordHandler.config.requiredEnvVars).toEqual([
        "DISCORD_WEBHOOK_URL",
      ]);
    });
  });

  describe("validateConfiguration", () => {
    it("should return true when webhook URL is configured", () => {
      expect(discordHandler.validateConfiguration()).toBe(true);
    });

    it("should return false when webhook URL is missing", () => {
      delete process.env.DISCORD_WEBHOOK_URL;
      expect(discordHandler.validateConfiguration()).toBe(false);
    });

    it("should return false when webhook URL is empty", () => {
      process.env.DISCORD_WEBHOOK_URL = "";
      expect(discordHandler.validateConfiguration()).toBe(false);
    });
  });

  describe("publish", () => {
    const testMessage = {
      message: "Test message",
      link: "https://test.com",
    };

    it("should successfully publish message", async () => {
      const mockResponse = {
        id: "123",
        content: "Test message https://test.com",
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await discordHandler.publish(testMessage);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.platformResponse).toEqual(mockResponse);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://discord.com/api/webhooks/123/abc?wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: "Test message https://test.com" }),
        },
      );
    });

    it("should return error for empty message", async () => {
      const result = await discordHandler.publish({
        message: "",
        link: "https://test.com",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Discord message cannot be empty");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return error when webhook URL is not configured", async () => {
      delete process.env.DISCORD_WEBHOOK_URL;

      const result = await discordHandler.publish(testMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Discord webhook URL not configured");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should handle Discord API error response", async () => {
      const errorText = "Invalid webhook";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(errorText),
      });

      const result = await discordHandler.publish(testMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Discord API error: 400 - Invalid webhook");
      expect(result.platformResponse).toEqual({
        status: 400,
        message: errorText,
      });
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await discordHandler.publish(testMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network connection failed");
    });

    it("should handle non-Error exceptions", async () => {
      mockFetch.mockRejectedValueOnce("String error");

      const result = await discordHandler.publish(testMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("String error");
    });
  });

  describe("healthCheck", () => {
    it("should return healthy when configuration is valid and webhook is accessible", async () => {
      // Discord returns 400 for empty content but webhook is accessible
      mockFetch.mockResolvedValueOnce({
        status: 400,
        ok: false,
      });

      const result = await discordHandler.healthCheck();

      expect(result.platform).toBe(Platform.Discord);
      expect(result.healthy).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.lastChecked).toBeInstanceOf(Date);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://discord.com/api/webhooks/123/abc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: "" }),
        },
      );
    });

    it("should return healthy when webhook responds with OK", async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
      });

      const result = await discordHandler.healthCheck();

      expect(result.healthy).toBe(true);
    });

    it("should return unhealthy when configuration is invalid", async () => {
      delete process.env.DISCORD_WEBHOOK_URL;

      const result = await discordHandler.healthCheck();

      expect(result.platform).toBe(Platform.Discord);
      expect(result.healthy).toBe(false);
      expect(result.error).toBe("Missing required configuration");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return unhealthy when webhook is not accessible", async () => {
      mockFetch.mockResolvedValueOnce({
        status: 404,
        ok: false,
      });

      const result = await discordHandler.healthCheck();

      expect(result.healthy).toBe(false);
      expect(result.error).toBe("Webhook not accessible: 404");
    });

    it("should return unhealthy on network error", async () => {
      const networkError = new Error("Network timeout");
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await discordHandler.healthCheck();

      expect(result.healthy).toBe(false);
      expect(result.error).toBe("Network timeout");
    });

    it("should handle non-Error exceptions in health check", async () => {
      mockFetch.mockRejectedValueOnce("Connection failed");

      const result = await discordHandler.healthCheck();

      expect(result.healthy).toBe(false);
      expect(result.error).toBe("Connection failed");
    });
  });
});
