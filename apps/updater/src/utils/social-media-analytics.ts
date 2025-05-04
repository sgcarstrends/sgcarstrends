import redis from "@updater/config/redis";
import type { SocialMediaPublishResult } from "@updater/utils/social-media-publisher";

export interface SocialMediaAnalytics {
  totalPublished: number;
  publishesByPlatform: Record<string, number>;
  lastPublished: string | null;
  successRate: number;
  recentPosts: Array<{
    timestamp: string;
    platform: string;
    success: boolean;
    url?: string;
  }>;
}

const ANALYTICS_KEY = "socialMedia:analytics";
const MAX_RECENT_POSTS = 25;

/**
 * Record a social media publish event for analytics
 *
 * @param results - Array of social media publish results
 * @returns Success status
 */
export const recordPublishEvent = async (
  results: SocialMediaPublishResult[],
): Promise<boolean> => {
  try {
    const currentAnalytics = await getAnalytics();

    const updatedAnalytics: SocialMediaAnalytics = {
      totalPublished: currentAnalytics.totalPublished + results.length,
      publishesByPlatform: { ...currentAnalytics.publishesByPlatform },
      lastPublished: new Date().toISOString(),
      successRate: 0,
      recentPosts: [
        ...results.map((result) => ({
          timestamp: new Date().toISOString(),
          platform: result.platform,
          success: result.success,
          url: result.url,
        })),
        ...currentAnalytics.recentPosts,
      ].slice(0, MAX_RECENT_POSTS),
    };

    for (const result of results) {
      const platform = result.platform;
      updatedAnalytics.publishesByPlatform[platform] =
        (updatedAnalytics.publishesByPlatform[platform] || 0) + 1;
    }

    const totalSuccessful = updatedAnalytics.recentPosts.filter(
      (post) => post.success,
    ).length;
    updatedAnalytics.successRate =
      totalSuccessful / updatedAnalytics.recentPosts.length;

    await redis.set(ANALYTICS_KEY, updatedAnalytics);

    return true;
  } catch (error) {
    console.error("Error recording social media analytics:", error);
    return false;
  }
};

/**
 * Get social media publishing analytics
 *
 * @returns Social media analytics data
 */
export const getAnalytics = async (): Promise<SocialMediaAnalytics> => {
  try {
    const analytics = await redis.get<SocialMediaAnalytics>(ANALYTICS_KEY);

    if (!analytics) {
      return {
        totalPublished: 0,
        publishesByPlatform: {},
        lastPublished: null,
        successRate: 0,
        recentPosts: [],
      };
    }

    return analytics;
  } catch (error) {
    console.error("Error getting social media analytics:", error);

    // Return default analytics on error
    return {
      totalPublished: 0,
      publishesByPlatform: {},
      lastPublished: null,
      successRate: 0,
      recentPosts: [],
    };
  }
};
