import { Platform } from "@api/types/social-media";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { social } from "../social";

// Mock the SocialMediaManager and platform handlers
vi.mock("@api/lib/social/discord/discord-handler");
vi.mock("@api/lib/social/linkedin/linkedin-handler");
vi.mock("@api/lib/social/twitter/twitter-handler");
vi.mock("@api/lib/social/telegram/telegram-handler");

const mockPublishToAll = vi.fn();
const mockPublishToPlatform = vi.fn();
const mockHealthCheck = vi.fn();
const mockGetEnabledPlatforms = vi.fn();
const mockGetAllPlatforms = vi.fn();

vi.mock("@api/lib/social/social-media-manager", () => ({
  SocialMediaManager: vi.fn(() => ({
    publishToAll: mockPublishToAll,
    publishToPlatform: mockPublishToPlatform,
    healthCheck: mockHealthCheck,
    getEnabledPlatforms: mockGetEnabledPlatforms,
    getAllPlatforms: mockGetAllPlatforms,
  })),
}));

describe("Social Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /post", () => {
    it("should publish to all platforms when no platform parameter", async () => {
      const testMessage = { message: "Test message", link: "https://test.com" };
      const mockResults = {
        success: true,
        successCount: 2,
        errorCount: 0,
        results: new Map([
          [Platform.Discord, { success: true, data: { id: "123" } }],
          [Platform.Telegram, { success: true, data: { id: "456" } }],
        ]),
      };

      mockPublishToAll.mockResolvedValue(mockResults);

      const res = await social.request("/post", {
        method: "POST",
        body: JSON.stringify(testMessage),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.successCount).toBe(2);
      expect(result.data.errorCount).toBe(0);
      expect(result.data.platforms).toEqual({
        Discord: { success: true, data: { id: "123" }, error: undefined },
        Telegram: { success: true, data: { id: "456" }, error: undefined },
      });

      expect(mockPublishToAll).toHaveBeenCalledWith(testMessage);
      expect(mockPublishToPlatform).not.toHaveBeenCalled();
    });

    it("should publish to specific platform when platform parameter provided", async () => {
      const testMessage = { message: "Test message", link: "https://test.com" };
      const mockResult = {
        success: true,
        data: { id: "123" },
      };

      mockPublishToPlatform.mockResolvedValue(mockResult);

      const res = await social.request("/post?platform=Discord", {
        method: "POST",
        body: JSON.stringify(testMessage),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: "123" });
      expect(result.platform).toBe("Discord");

      expect(mockPublishToPlatform).toHaveBeenCalledWith(
        Platform.Discord,
        testMessage,
      );
      expect(mockPublishToAll).not.toHaveBeenCalled();
    });

    it("should return 400 for missing message", async () => {
      const res = await social.request("/post", {
        method: "POST",
        body: JSON.stringify({ link: "https://test.com" }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Message is required");

      expect(mockPublishToAll).not.toHaveBeenCalled();
      expect(mockPublishToPlatform).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid platform parameter", async () => {
      const testMessage = { message: "Test message", link: "https://test.com" };

      const res = await social.request("/post?platform=InvalidPlatform", {
        method: "POST",
        body: JSON.stringify(testMessage),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid platform. Must be one of:");

      expect(mockPublishToAll).not.toHaveBeenCalled();
      expect(mockPublishToPlatform).not.toHaveBeenCalled();
    });

    it("should handle platform publishing failure", async () => {
      const testMessage = { message: "Test message", link: "https://test.com" };
      const mockResult = {
        success: false,
        error: "API rate limited",
      };

      mockPublishToPlatform.mockResolvedValue(mockResult);

      const res = await social.request("/post?platform=Twitter", {
        method: "POST",
        body: JSON.stringify(testMessage),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(200); // Still 200 as the request was processed
      expect(result.success).toBe(false);
      expect(result.error).toBe("API rate limited");
      expect(result.platform).toBe("Twitter");
    });

    it("should handle JSON parsing errors", async () => {
      const res = await social.request("/post", {
        method: "POST",
        body: "invalid json",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle social media manager exceptions", async () => {
      const testMessage = { message: "Test message", link: "https://test.com" };
      mockPublishToAll.mockRejectedValue(new Error("Manager crashed"));

      const res = await social.request("/post", {
        method: "POST",
        body: JSON.stringify(testMessage),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      expect(res.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Manager crashed");
    });
  });

  describe("GET /health", () => {
    it("should return healthy status when all platforms are healthy", async () => {
      const mockHealthResults = [
        {
          platform: Platform.Discord,
          healthy: true,
          lastChecked: new Date("2024-01-01T00:00:00Z"),
        },
        {
          platform: Platform.Telegram,
          healthy: true,
          lastChecked: new Date("2024-01-01T00:00:00Z"),
        },
      ];

      mockHealthCheck.mockResolvedValue(mockHealthResults);

      const res = await social.request("/health");
      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.healthy).toBe(true);
      expect(result.platforms).toHaveLength(2);
      expect(result.platforms[0]).toEqual({
        platform: Platform.Discord,
        healthy: true,
        error: undefined,
        lastChecked: "2024-01-01T00:00:00.000Z",
      });
    });

    it("should return unhealthy status when some platforms are unhealthy", async () => {
      const mockHealthResults = [
        {
          platform: Platform.Discord,
          healthy: true,
          lastChecked: new Date("2024-01-01T00:00:00Z"),
        },
        {
          platform: Platform.LinkedIn,
          healthy: false,
          error: "API unreachable",
          lastChecked: new Date("2024-01-01T00:00:00Z"),
        },
      ];

      mockHealthCheck.mockResolvedValue(mockHealthResults);

      const res = await social.request("/health");
      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.healthy).toBe(false);
      expect(result.platforms).toHaveLength(2);
      expect(result.platforms[1]).toEqual({
        platform: Platform.LinkedIn,
        healthy: false,
        error: "API unreachable",
        lastChecked: "2024-01-01T00:00:00.000Z",
      });
    });

    it("should handle health check exceptions", async () => {
      mockHealthCheck.mockRejectedValue(new Error("Health check failed"));

      const res = await social.request("/health");
      const result = await res.json();

      expect(res.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Health check failed");
    });
  });

  describe("GET /platforms", () => {
    it("should return platform information", async () => {
      const mockEnabledPlatforms = [
        { platform: Platform.Discord, validateConfiguration: () => true },
        { platform: Platform.Telegram, validateConfiguration: () => true },
      ];

      const mockAllPlatforms = [
        {
          platform: Platform.Discord,
          config: { enabled: true },
          validateConfiguration: () => true,
        },
        {
          platform: Platform.LinkedIn,
          config: { enabled: false },
          validateConfiguration: () => false,
        },
        {
          platform: Platform.Twitter,
          config: { enabled: true },
          validateConfiguration: () => false,
        },
        {
          platform: Platform.Telegram,
          config: { enabled: true },
          validateConfiguration: () => true,
        },
      ];

      mockGetEnabledPlatforms.mockReturnValue(mockEnabledPlatforms);
      mockGetAllPlatforms.mockReturnValue(mockAllPlatforms);

      const res = await social.request("/platforms");
      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.enabled).toEqual([
        { platform: Platform.Discord, configured: true },
        { platform: Platform.Telegram, configured: true },
      ]);
      expect(result.data.all).toEqual([
        { platform: Platform.Discord, enabled: true, configured: true },
        { platform: Platform.LinkedIn, enabled: false, configured: false },
        { platform: Platform.Twitter, enabled: true, configured: false },
        { platform: Platform.Telegram, enabled: true, configured: true },
      ]);
    });

    it("should handle platforms query exceptions", async () => {
      mockGetEnabledPlatforms.mockImplementation(() => {
        throw new Error("Platform query failed");
      });

      const res = await social.request("/platforms");
      const result = await res.json();

      expect(res.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Platform query failed");
    });
  });
});
