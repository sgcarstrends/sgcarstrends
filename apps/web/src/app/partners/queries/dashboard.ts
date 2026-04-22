import {
  campaigns,
  db,
  eq,
  sql,
  sum,
} from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

export interface PartnerDashboardData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  clickThroughRate: number;
}

/**
 * Get dashboard summary data for a specific advertiser.
 * Uses private cache since it's user-specific data.
 */
export async function getPartnerDashboardData(
  advertiserId: string,
): Promise<PartnerDashboardData> {
  "use cache: private";
  cacheLife("hours");
  cacheTag(`partner:dashboard:${advertiserId}`);

  const [stats] = await db
    .select({
      totalCampaigns: sql<number>`count(*)::int`,
      activeCampaigns: sql<number>`count(*) filter (where ${campaigns.status} = 'active')::int`,
      totalImpressions: sql<number>`coalesce(sum(${campaigns.impressions}), 0)::int`,
      totalClicks: sql<number>`coalesce(sum(${campaigns.clicks}), 0)::int`,
    })
    .from(campaigns)
    .where(eq(campaigns.advertiserId, advertiserId));

  const totalImpressions = stats?.totalImpressions ?? 0;
  const totalClicks = stats?.totalClicks ?? 0;
  const clickThroughRate =
    totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return {
    totalCampaigns: stats?.totalCampaigns ?? 0,
    activeCampaigns: stats?.activeCampaigns ?? 0,
    totalImpressions,
    totalClicks,
    clickThroughRate: Math.round(clickThroughRate * 100) / 100,
  };
}
