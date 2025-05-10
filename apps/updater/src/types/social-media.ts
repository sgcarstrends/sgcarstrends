import type { LICreateResponse } from "linkedin-api-client";

export type CreatedEntityId = LICreateResponse["createdEntityId"];

interface PostToSocialMediaParam {
  message: string;
  link: string;
}

export interface PostToDiscordParam extends PostToSocialMediaParam {}
export interface PostToLinkedInParam extends PostToSocialMediaParam {}
export interface PostToTelegramParam extends PostToSocialMediaParam {}
export interface PostToTwitterParam extends PostToSocialMediaParam {}

export type ResharePostParam = {
  createdEntityId: CreatedEntityId;
  message: string;
};
