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
  let linkedInHandler: PlatformHandler;
  let twitterHandler: PlatformHandler;
  let telegramHandler: PlatformHandler;
  let socialMediaManager: SocialMediaManager;
  let testMessage: SocialMessage;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock handlers
    linkedInHandler = createMockHandler(Platform.LinkedIn);
    twitterHandler = createMockHandler(Platform.Twitter);
    telegramHandler = createMockHandler(Platform.Telegram);

    // Create manager instance
    socialMediaManager = new SocialMediaManager([
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
      expect(socialMediaManager.getAllPlatforms()).toHaveLength(3);
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
      vi.mocked(linkedInHandler.publish).mockResolvedValue(successResult);
      vi.mocked(twitterHandler.publish).mockResolvedValue(successResult);
      vi.mocked(telegramHandler.publish).mockResolvedValue(successResult);

      const result = await socialMediaManager.publishToAll(testMessage);

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(3);
      expect(result.errorCount).toBe(0);
      expect(result.results.size).toBe(3);

      const platforms = [
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
      vi.mocked(linkedInHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });
      vi.mocked(twitterHandler.publish).mockResolvedValue({
        success: false,
        error: "API error",
      });
      vi.mocked(telegramHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "456" },
      });

      const result = await socialMediaManager.publishToAll(testMessage);

      expect(result.success).toBe(false); // Overall failure due to errors
      expect(result.successCount).toBe(2);
      expect(result.errorCount).toBe(1);
      expect(result.results.size).toBe(3);
    });

    it("should handle platform throwing exceptions", async () => {
      // Setup responses with exceptions
      vi.mocked(linkedInHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });
      vi.mocked(twitterHandler.publish).mockRejectedValue(
        new Error("Connection failed"),
      );
      vi.mocked(telegramHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "456" },
      });

      const result = await socialMediaManager.publishToAll(testMessage);

      expect(result.success).toBe(false);
      expect(result.successCount).toBe(2);
      expect(result.errorCount).toBe(1);

      // Check that failed platforms have error results
      expect(result.results.get(Platform.Twitter)?.success).toBe(false);
      expect(result.results.get(Platform.Twitter)?.error).toBe(
        "Connection failed",
      );
    });

    it("should skip disabled platforms", async () => {
      // Create manager with disabled platform
      const disabledHandler = createMockHandler(Platform.LinkedIn, false);
      const managerWithDisabled = new SocialMediaManager([
        twitterHandler,
        disabledHandler,
      ]);

      vi.mocked(twitterHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });

      const result = await managerWithDisabled.publishToAll(testMessage);

      expect(result.successCount).toBe(1);
      expect(result.results.size).toBe(1);
      expect(twitterHandler.publish).toHaveBeenCalled();
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
        twitterHandler,
        unconfiguredHandler,
      ]);

      vi.mocked(twitterHandler.publish).mockResolvedValue({
        success: true,
        data: { id: "123" },
      });

      const result = await managerWithUnconfigured.publishToAll(testMessage);

      expect(result.successCount).toBe(1);
      expect(result.results.size).toBe(1);
      expect(twitterHandler.publish).toHaveBeenCalled();
      expect(unconfiguredHandler.publish).not.toHaveBeenCalled();
    });
  });

  describe("publishToPlatform", () => {
    it("should publish to specific platform successfully", async () => {
      const successResult: PublishResult = {
        success: true,
        data: { id: "123" },
      };
      vi.mocked(twitterHandler.publish).mockResolvedValue(successResult);

      const result = await socialMediaManager.publishToPlatform(
        Platform.Twitter,
        testMessage,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: "123" });
      expect(twitterHandler.publish).toHaveBeenCalledWith({
        ...testMessage,
        link: "https://test.com/?utm_source=twitter&utm_medium=social&utm_campaign=blog",
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
      vi.mocked(twitterHandler.publish).mockRejectedValue(
        new Error("Connection failed"),
      );

      const result = await socialMediaManager.publishToPlatform(
        Platform.Twitter,
        testMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection failed");
    });
  });

  describe("getEnabledPlatforms", () => {
    it("should return only enabled and configured platforms", () => {
      const enabledPlatforms = socialMediaManager.getEnabledPlatforms();

      expect(enabledPlatforms).toHaveLength(3);
      expect(enabledPlatforms.map((h) => h.platform)).toEqual([
        Platform.LinkedIn,
        Platform.Twitter,
        Platform.Telegram,
      ]);
    });

    it("should exclude disabled platforms", () => {
      const disabledHandler = createMockHandler(Platform.LinkedIn, false);
      const managerWithDisabled = new SocialMediaManager([
        twitterHandler,
        disabledHandler,
      ]);

      const enabledPlatforms = managerWithDisabled.getEnabledPlatforms();

      expect(enabledPlatforms).toHaveLength(1);
      expect(enabledPlatforms[0].platform).toBe(Platform.Twitter);
    });

    it("should exclude unconfigured platforms", () => {
      const unconfiguredHandler = createMockHandler(
        Platform.LinkedIn,
        true,
        false,
      );
      const managerWithUnconfigured = new SocialMediaManager([
        twitterHandler,
        unconfiguredHandler,
      ]);

      const enabledPlatforms = managerWithUnconfigured.getEnabledPlatforms();

      expect(enabledPlatforms).toHaveLength(1);
      expect(enabledPlatforms[0].platform).toBe(Platform.Twitter);
    });
  });

  describe("healthCheck", () => {
    it("should check health of all platforms", async () => {
      const healthyResult: PlatformHealth = {
        platform: Platform.LinkedIn,
        healthy: true,
        lastChecked: new Date(),
      };

      const unhealthyResult: PlatformHealth = {
        platform: Platform.Twitter,
        healthy: false,
        error: "API unreachable",
        lastChecked: new Date(),
      };

      vi.mocked(linkedInHandler.healthCheck).mockResolvedValue(healthyResult);
      vi.mocked(twitterHandler.healthCheck).mockResolvedValue(unhealthyResult);
      vi.mocked(telegramHandler.healthCheck).mockResolvedValue(healthyResult);

      const results = await socialMediaManager.healthCheck();

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(healthyResult);
      expect(results[1]).toEqual(unhealthyResult);
    });

    it("should handle health check exceptions", async () => {
      vi.mocked(linkedInHandler.healthCheck).mockRejectedValue(
        new Error("Health check failed"),
      );
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

      expect(results).toHaveLength(3);
      expect(results[0].healthy).toBe(false);
      expect(results[0].error).toBe("Health check failed");
      expect(results[1].healthy).toBe(true);
      expect(results[2].healthy).toBe(true);
    });
  });

  describe("isPlatformAvailable", () => {
    it("should return true for enabled and configured platform", () => {
      expect(socialMediaManager.isPlatformAvailable(Platform.Twitter)).toBe(
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
