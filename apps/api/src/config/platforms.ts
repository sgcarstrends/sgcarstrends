import { LinkedInHandler } from "@api/lib/social/linkedin/linkedin-handler";
import { SocialMediaManager } from "@api/lib/social/social-media-manager";
import { TelegramHandler } from "@api/lib/social/telegram/telegram-handler";
import { TwitterHandler } from "@api/lib/social/twitter/twitter-handler";

/**
 * Centralized social media manager instance
 * Configured with all available platform handlers
 */
export const socialMediaManager = new SocialMediaManager([
  new LinkedInHandler(),
  new TwitterHandler(),
  new TelegramHandler(),
]);
