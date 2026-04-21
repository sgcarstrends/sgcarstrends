import {
  and,
  campaigns,
  campaignEvents,
  db,
  desc,
  eq,
  gte,
  lte,
  type SelectCampaign,
  type SelectCampaignEvent,
} from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get all campaigns for a specific advertiser.
 * Uses private cache since it's user-specific data.
 */
export async function getPartnerCampaigns(
  advertiserId: string,
): Promise<SelectCampaign[]> {
  "use cache: private";
  cacheLife("hours");
  cacheTag(`campaigns:advertiser:${advertiserId}`);

  return db.query.campaigns.findMany({
    where: eq(campaigns.advertiserId, advertiserId),
    orderBy: desc(campaigns.createdAt),
  });
}

/**
 * Get a single campaign by ID.
 * Uses private cache since it's user-specific data.
 */
export async function getCampaignById(
  id: string,
): Promise<SelectCampaign | undefined> {
  "use cache: private";
  cacheLife("days");
  cacheTag(`campaign:${id}`);

  return db.query.campaigns.findFirst({
    where: eq(campaigns.id, id),
  });
}

/**
 * Get campaign events (analytics) for a specific campaign.
 * Uses private cache since it's user-specific data.
 */
export async function getCampaignEvents(
  campaignId: string,
): Promise<SelectCampaignEvent[]> {
  "use cache: private";
  cacheLife("hours");
  cacheTag(`campaign:events:${campaignId}`);

  return db.query.campaignEvents.findMany({
    where: eq(campaignEvents.campaignId, campaignId),
    orderBy: desc(campaignEvents.date),
  });
}

/**
 * Get active campaign for a specific placement type.
 * Uses remote cache since it's shared public data served at the edge.
 */
export async function getActiveCampaign(
  placementType: string,
): Promise<SelectCampaign | undefined> {
  "use cache: remote";
  cacheLife("days");
  cacheTag(`ads:${placementType}`);

  const now = new Date();

  return db.query.campaigns.findFirst({
    where: and(
      eq(campaigns.placementType, placementType),
      eq(campaigns.status, "active"),
      lte(campaigns.startDate, now),
      gte(campaigns.endDate, now),
    ),
  });
}
