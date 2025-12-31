import { LinkedInHandler } from "@web/lib/social/linkedin/linkedin-handler";
import { SocialMediaManager } from "@web/lib/social/social-media-manager";
import { TelegramHandler } from "@web/lib/social/telegram/telegram-handler";
import { TwitterHandler } from "@web/lib/social/twitter/twitter-handler";

/**
 * Centralized social media manager instance
 * Configured with all available platform handlers
 */
export const socialMediaManager = new SocialMediaManager([
  new LinkedInHandler(),
  new TwitterHandler(),
  new TelegramHandler(),
]);
