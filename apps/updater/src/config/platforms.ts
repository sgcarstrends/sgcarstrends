import { postToDiscord } from "@updater/lib/discord/post-to-discord";
import { postToLinkedin } from "@updater/lib/linkedin/post-to-linkedin";
import { postToTelegram } from "@updater/lib/telegram/post-to-telegram";
import { postToTwitter } from "@updater/lib/twitter/post-to-twitter";
import type { IPlatform } from "@updater/lib/workflow";
import { Stage } from "@updater/types";
import { Platform } from "@updater/types/social-media";
import { Resource } from "sst";

const isProduction = Resource.App.stage === Stage.PRODUCTION;

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
