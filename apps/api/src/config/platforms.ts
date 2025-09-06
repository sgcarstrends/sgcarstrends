import { postToDiscord } from "@api/lib/social/discord/post-to-discord";
import { postToLinkedin } from "@api/lib/social/linkedin/post-to-linkedin";
import { postToTelegram } from "@api/lib/social/telegram/post-to-telegram";
import { postToTwitter } from "@api/lib/social/twitter/post-to-twitter";
import type { IPlatform } from "@api/lib/workflows/workflow";
import { Stage } from "@api/types";
import { Platform } from "@api/types/social-media";

const isProduction = process.env.STAGE === Stage.PRODUCTION;

export const platforms: IPlatform[] = [
  {
    platform: Platform.Discord,
    handler: postToDiscord,
    enabled: true,
  },
  {
    platform: Platform.LinkedIn,
    handler: postToLinkedin,
    enabled: isProduction,
  },
  {
    platform: Platform.Telegram,
    handler: postToTelegram,
    enabled: true,
  },
  {
    platform: Platform.Twitter,
    handler: postToTwitter,
    enabled: isProduction,
  },
];
