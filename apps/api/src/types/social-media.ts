export type Platform = "Discord" | "LinkedIn" | "Telegram" | "Twitter";
export namespace Platform {
  export const Discord: Platform = "Discord";
  export const LinkedIn: Platform = "LinkedIn";
  export const Telegram: Platform = "Telegram";
  export const Twitter: Platform = "Twitter";
}

export interface PostToSocialMediaParam {
  message: string;
  link: string;
}

export interface PostToDiscordParam extends PostToSocialMediaParam {}
export interface PostToLinkedInParam extends PostToSocialMediaParam {}
export interface PostToTelegramParam extends PostToSocialMediaParam {}
export interface PostToTwitterParam extends PostToSocialMediaParam {}
