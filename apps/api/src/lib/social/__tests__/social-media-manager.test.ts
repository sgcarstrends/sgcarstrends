import type {
  PlatformHandler,
  PlatformHealth,
  PublishResult,
  SocialMessage,
} from "@api/lib/social/interfaces/platform-handler";
import { SocialMediaManager } from "@api/lib/social/social-media-manager";
import { Platform } from "@api/types/social-media";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock platform handler
const createMockHandler = (
  platform: Platform,
  enabled = true,
  configured = true,
): PlatformHandler => ({
  platform,
  config: {
    enabled,
    requiredEnvVars: ["TEST_ENV"],
  },
  publish: vi.fn(),
  healthCheck: vi.fn(),
  validateConfiguration: vi.fn(() => configured),
});

describe("SocialMediaManager", () => {
  let discordHandler: PlatformHandler;
  let linkedInHandler: PlatformHandler;
  let twitterHandler: PlatformHandler;
  let telegramHandler: PlatformHandler;
  let socialMediaManager: SocialMediaManager;
  let testMessage: SocialMessage;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock handlers
    discordHandler = createMockHandler(Platform.Discord);
    linkedInHandler = createMockHandler(Platform.LinkedIn);
    twitterHandler = createMockHandler(Platform.Twitter);
    telegramHandler = createMockHandler(Platform.Telegram);

    // Create manager instance
    socialMediaManager = new SocialMediaManager([
      discordHandler,
      linkedInHandler,
      twitterHandler,
      telegramHandler,
    ]);

    testMessage = {
      message: "Test message",
      link: "https://test.com",
    };
  });

  describe("constructor", () => {
    it("should initialize with all provided platform handlers", () => {
      expect(socialMediaManager.getAllPlatforms()).toHaveLength(4);
      expect(socialMediaManager.getPlatformHandler(Platform.Discord)).toBe(
        discordHandler,
      );
      expect(socialMediaManager.getPlatformHandler(Platform.LinkedIn)).toBe(
        linkedInHandler,
      );
      expect(socialMediaManager.getPlatformHandler(Platform.Twitter)).toBe(
        twitterHandler,
      );
      expect(socialMediaManager.getPlatformHandler(Platform.Telegram)).toBe(
        telegramHandler,
      );
    });
  });

  describe("publishToAll", () => {
    it("should publish to all enabled and configured platforms", async () => {
      // Setup successful publish responses
      const successResult: PublishResult = {
        success: true,
        data: { id: "123" },
      };
      vi.mocked(discordHandler.publish).mockResolvedValue(successResult);
      vi.mocked(linkedInHandler.publish).mockResolvedValue(successResult);
      vi.mocked(twitterHandler.publish).mockResolvedValue(successResult);
      vi.mocked(telegramHandler.publish).mockResolvedValue(successResult);

      const result = await socialMediaManager.publishToAll(testMessage);

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(4);
      expect(result.errorCount).toBe(0);
      expect(result.results.size).toBe(4);

      const platforms = [
        { handler: discordHandler, platform: "discord" },
        { handler: linkedInHandler, platform: "linkedin" },
        { handler: twitterHandler, platform: "twitter" },
        { handler: telegramHandler, platform: "telegram" },
      ];

      platforms.forEach(({ handler, platform }) => {
        expect(handler.publish).toHaveBeenCalledWith({
          ...testMessage,
          link: `https://test.com/?utm_source=${platform}&utm_medium=social&utm_campaign=blog`,
        });
      });
    });

    it("should handle mixed success and failure results", async () => {
      // Setup mixed responses
      vi.mocked(discordHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });
      vi.mocked(linkedInHandler.publish).mockResolvedValue({
        success: false,
        error: "API error",
      });
      vi.mocked(twitterHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "456" },
      });
      vi.mocked(telegramHandler.publish).mockResolvedValue({
        success: false,
        error: "Network error",
      });

      const result = await socialMediaManager.publishToAll(testMessage);

      expect(result.success).toBe(false); // Overall failure due to errors
      expect(result.successCount).toBe(2);
      expect(result.errorCount).toBe(2);
      expect(result.results.size).toBe(4);
    });

    it("should handle platform throwing exceptions", async () => {
      // Setup responses with exceptions
      vi.mocked(discordHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });
      vi.mocked(linkedInHandler.publish).mockRejectedValue(
        new Error("Connection failed"),
      );
      vi.mocked(twitterHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "456" },
      });
      vi.mocked(telegramHandler.publish).mockRejectedValue(
        new Error("Rate limited"),
      );

      const result = await socialMediaManager.publishToAll(testMessage);

      expect(result.success).toBe(false);
      expect(result.successCount).toBe(2);
      expect(result.errorCount).toBe(2);

      // Check that failed platforms have error results
      expect(result.results.get(Platform.LinkedIn)?.success).toBe(false);
      expect(result.results.get(Platform.LinkedIn)?.error).toBe(
        "Connection failed",
      );
      expect(result.results.get(Platform.Telegram)?.success).toBe(false);
      expect(result.results.get(Platform.Telegram)?.error).toBe("Rate limited");
    });

    it("should skip disabled platforms", async () => {
      // Create manager with disabled platform
      const disabledHandler = createMockHandler(Platform.LinkedIn, false);
      const managerWithDisabled = new SocialMediaManager([
        discordHandler,
        disabledHandler,
      ]);

      vi.mocked(discordHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });

      const result = await managerWithDisabled.publishToAll(testMessage);

      expect(result.successCount).toBe(1);
      expect(result.results.size).toBe(1);
      expect(discordHandler.publish).toHaveBeenCalled();
      expect(disabledHandler.publish).not.toHaveBeenCalled();
    });

    it("should skip unconfigured platforms", async () => {
      // Create manager with unconfigured platform
      const unconfiguredHandler = createMockHandler(
        Platform.LinkedIn,
        true,
        false,
      );
      const managerWithUnconfigured = new SocialMediaManager([
        discordHandler,
        unconfiguredHandler,
      ]);

      vi.mocked(discordHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });

      const result = await managerWithUnconfigured.publishToAll(testMessage);

      expect(result.successCount).toBe(1);
      expect(result.results.size).toBe(1);
      expect(discordHandler.publish).toHaveBeenCalled();
      expect(unconfiguredHandler.publish).not.toHaveBeenCalled();
    });
  });

  describe("publishToPlatform", () => {
    it("should publish to specific platform successfully", async () => {
      const successResult: PublishResult = {
        success: true,
        data: { id: "123" },
      };
      vi.mocked(discordHandler.publish).mockResolvedValue(successResult);

      const result = await socialMediaManager.publishToPlatform(
        Platform.Discord,
        testMessage,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: "123" });
      expect(discordHandler.publish).toHaveBeenCalledWith({
        ...testMessage,
        link: "https://test.com/?utm_source=discord&utm_medium=social&utm_campaign=blog",
      });
    });

    it("should return error for non-existent platform", async () => {
      const result = await socialMediaManager.publishToPlatform(
        "NonExistentPlatform" as Platform,
        testMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Platform NonExistentPlatform not found");
    });

    it("should return error for disabled platform", async () => {
      const disabledHandler = createMockHandler(Platform.LinkedIn, false);
      const managerWithDisabled = new SocialMediaManager([disabledHandler]);

      const result = await managerWithDisabled.publishToPlatform(
        Platform.LinkedIn,
        testMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Platform LinkedIn is disabled");
      expect(disabledHandler.publish).not.toHaveBeenCalled();
    });

    it("should return error for unconfigured platform", async () => {
      const unconfiguredHandler = createMockHandler(
        Platform.LinkedIn,
        true,
        false,
      );
      const managerWithUnconfigured = new SocialMediaManager([
        unconfiguredHandler,
      ]);

      const result = await managerWithUnconfigured.publishToPlatform(
        Platform.LinkedIn,
        testMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Platform LinkedIn configuration is invalid");
      expect(unconfiguredHandler.publish).not.toHaveBeenCalled();
    });

    it("should handle platform throwing exception", async () => {
      vi.mocked(discordHandler.publish).mockRejectedValue(
        new Error("Connection failed"),
      );

      const result = await socialMediaManager.publishToPlatform(
        Platform.Discord,
        testMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection failed");
    });
  });

  describe("getEnabledPlatforms", () => {
    it("should return only enabled and configured platforms", () => {
      const enabledPlatforms = socialMediaManager.getEnabledPlatforms();

      expect(enabledPlatforms).toHaveLength(4);
      expect(enabledPlatforms.map((h) => h.platform)).toEqual([
        Platform.Discord,
        Platform.LinkedIn,
        Platform.Twitter,
        Platform.Telegram,
      ]);
    });

    it("should exclude disabled platforms", () => {
      const disabledHandler = createMockHandler(Platform.LinkedIn, false);
      const managerWithDisabled = new SocialMediaManager([
        discordHandler,
        disabledHandler,
      ]);

      const enabledPlatforms = managerWithDisabled.getEnabledPlatforms();

      expect(enabledPlatforms).toHaveLength(1);
      expect(enabledPlatforms[0].platform).toBe(Platform.Discord);
    });

    it("should exclude unconfigured platforms", () => {
      const unconfiguredHandler = createMockHandler(
        Platform.LinkedIn,
        true,
        false,
      );
      const managerWithUnconfigured = new SocialMediaManager([
        discordHandler,
        unconfiguredHandler,
      ]);

      const enabledPlatforms = managerWithUnconfigured.getEnabledPlatforms();

      expect(enabledPlatforms).toHaveLength(1);
      expect(enabledPlatforms[0].platform).toBe(Platform.Discord);
    });
  });

  describe("healthCheck", () => {
    it("should check health of all platforms", async () => {
      const healthyResult: PlatformHealth = {
        platform: Platform.Discord,
        healthy: true,
        lastChecked: new Date(),
      };

      const unhealthyResult: PlatformHealth = {
        platform: Platform.LinkedIn,
        healthy: false,
        error: "API unreachable",
        lastChecked: new Date(),
      };

      vi.mocked(discordHandler.healthCheck).mockResolvedValue(healthyResult);
      vi.mocked(linkedInHandler.healthCheck).mockResolvedValue(unhealthyResult);
      vi.mocked(twitterHandler.healthCheck).mockResolvedValue(healthyResult);
      vi.mocked(telegramHandler.healthCheck).mockResolvedValue(healthyResult);

      const results = await socialMediaManager.healthCheck();

      expect(results).toHaveLength(4);
      expect(results[0]).toEqual(healthyResult);
      expect(results[1]).toEqual(unhealthyResult);
    });

    it("should handle health check exceptions", async () => {
      vi.mocked(discordHandler.healthCheck).mockRejectedValue(
        new Error("Health check failed"),
      );
      vi.mocked(linkedInHandler.healthCheck).mockResolvedValue({
        platform: Platform.LinkedIn,
        healthy: true,
        lastChecked: new Date(),
      });
      vi.mocked(twitterHandler.healthCheck).mockResolvedValue({
        platform: Platform.Twitter,
        healthy: true,
        lastChecked: new Date(),
      });
      vi.mocked(telegramHandler.healthCheck).mockResolvedValue({
        platform: Platform.Telegram,
        healthy: true,
        lastChecked: new Date(),
      });

      const results = await socialMediaManager.healthCheck();

      expect(results).toHaveLength(4);
      expect(results[0].healthy).toBe(false);
      expect(results[0].error).toBe("Health check failed");
      expect(results[1].healthy).toBe(true);
      expect(results[2].healthy).toBe(true);
      expect(results[3].healthy).toBe(true);
    });
  });

  describe("isPlatformAvailable", () => {
    it("should return true for enabled and configured platform", () => {
      expect(socialMediaManager.isPlatformAvailable(Platform.Discord)).toBe(
        true,
      );
    });

    it("should return false for disabled platform", () => {
      const disabledHandler = createMockHandler(Platform.LinkedIn, false);
      const manager = new SocialMediaManager([disabledHandler]);

      expect(manager.isPlatformAvailable(Platform.LinkedIn)).toBe(false);
    });

    it("should return false for unconfigured platform", () => {
      const unconfiguredHandler = createMockHandler(
        Platform.LinkedIn,
        true,
        false,
      );
      const manager = new SocialMediaManager([unconfiguredHandler]);

      expect(manager.isPlatformAvailable(Platform.LinkedIn)).toBe(false);
    });

    it("should return false for non-existent platform", () => {
      expect(
        socialMediaManager.isPlatformAvailable("NonExistent" as Platform),
      ).toBe(false);
    });
  });
});
