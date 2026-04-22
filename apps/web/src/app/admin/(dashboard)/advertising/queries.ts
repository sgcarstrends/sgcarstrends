import {
  advertisers,
  campaigns,
  db,
  desc,
  sql,
  type SelectAdvertiser,
  type SelectCampaign,
} from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

export interface AdvertisingOverview {
  totalAdvertisers: number;
  activeAdvertisers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
}

/**
 * Get advertising overview stats for admin dashboard.
 * Uses remote cache since it's shared data that benefits from edge caching.
 */
export async function getAdvertisingOverview(): Promise<AdvertisingOverview> {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("advertising");

  const [advertiserStats] = await db
    .select({
      totalAdvertisers: sql<number>`count(*)::int`,
      activeAdvertisers: sql<number>`count(*) filter (where ${advertisers.status} = 'active')::int`,
    })
    .from(advertisers);

  const [campaignStats] = await db
    .select({
      totalCampaigns: sql<number>`count(*)::int`,
      activeCampaigns: sql<number>`count(*) filter (where ${campaigns.status} = 'active')::int`,
      totalImpressions: sql<number>`coalesce(sum(${campaigns.impressions}), 0)::int`,
      totalClicks: sql<number>`coalesce(sum(${campaigns.clicks}), 0)::int`,
    })
    .from(campaigns);

  return {
    totalAdvertisers: advertiserStats?.totalAdvertisers ?? 0,
    activeAdvertisers: advertiserStats?.activeAdvertisers ?? 0,
    totalCampaigns: campaignStats?.totalCampaigns ?? 0,
    activeCampaigns: campaignStats?.activeCampaigns ?? 0,
    totalImpressions: campaignStats?.totalImpressions ?? 0,
    totalClicks: campaignStats?.totalClicks ?? 0,
    totalRevenue: 0, // TODO: Calculate from Stripe payments
  };
}

/**
 * Get all advertisers for admin view.
 * Uses shared cache since all admins see the same data.
 */
export async function getAllAdvertisers(): Promise<SelectAdvertiser[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("advertisers");

  return db.query.advertisers.findMany({
    orderBy: desc(advertisers.createdAt),
  });
}

/**
 * Get all campaigns for admin view.
 * Uses shared cache since all admins see the same data.
 */
export async function getAllCampaigns(): Promise<
  (SelectCampaign & { advertiserName: string })[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag("campaigns");

  const results = await db
    .select({
      campaign: campaigns,
      advertiserName: advertisers.companyName,
    })
    .from(campaigns)
    .leftJoin(advertisers, sql`${campaigns.advertiserId} = ${advertisers.id}`)
    .orderBy(desc(campaigns.createdAt));

  return results.map((row) => ({
    ...row.campaign,
    advertiserName: row.advertiserName ?? "Unknown",
  }));
}
