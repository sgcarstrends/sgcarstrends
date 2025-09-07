import type { Platform } from "@api/types/social-media";

export interface SocialMessage {
  message: string;
  link: string;
}

export interface PublishResult {
  success: boolean;
  data?: unknown;
  error?: string;
  platformResponse?: unknown;
}

export interface PlatformHealth {
  platform: Platform;
  healthy: boolean;
  error?: string;
  lastChecked: Date;
}

export interface PlatformConfig {
  enabled: boolean;
  requiredEnvVars: string[];
  validateConfig?(): boolean;
}

export interface PlatformHandler {
  readonly platform: Platform;
  readonly config: PlatformConfig;

  /**
   * Publish a message to this platform
   */
  publish(message: SocialMessage): Promise<PublishResult>;

  /**
   * Check if this platform is healthy and can accept posts
   */
  healthCheck(): Promise<PlatformHealth>;

  /**
   * Validate that all required configuration is available
   */
  validateConfiguration(): boolean;
}
