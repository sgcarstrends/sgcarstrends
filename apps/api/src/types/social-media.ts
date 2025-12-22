export type Platform = "LinkedIn" | "Telegram" | "Twitter";
export namespace Platform {
  export const LinkedIn: Platform = "LinkedIn";
  export const Telegram: Platform = "Telegram";
  export const Twitter: Platform = "Twitter";
}

export interface PostToSocialMediaParam {
  message: string;
  link: string;
}

export interface PostToLinkedInParam extends PostToSocialMediaParam {}
export interface PostToTelegramParam extends PostToSocialMediaParam {}
export interface PostToTwitterParam extends PostToSocialMediaParam {}
