"use server";

import { API_URL } from "@web/config";
import { COE_CHART_COLOURS } from "@web/lib/utils/coe";
import type { COEResult } from "@web/types";
import { RevalidateTags } from "@web/types";
import type { Pqp } from "@web/types/coe";
import { CACHE_DURATION, fetchApi } from "@web/utils/fetch-api";

// COE-specific types
export interface COEMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export interface COEMarketShareResponse {
  period: string;
  totalQuota: number;
  data: COEMarketShareData[];
  highestPremium: {
    category: string;
    premium: number;
  };
}

export interface COETrendData {
  period: string;
  categories: Array<{
    category: string;
    premium: number;
    quota: number;
    bidsReceived: number;
  }>;
}

export interface COEComparisonMetrics {
  currentPeriod: COEResult[];
  previousPeriod: COEResult[];
  averagePremiumChange: number;
  categoryChanges: Array<{
    category: string;
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }>;
}

export const getCOEResults = async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe`, {
    next: {
      tags: [RevalidateTags.COE],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getLatestCOEResults = async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe/latest`, {
    next: {
      tags: [RevalidateTags.COE, RevalidateTags.Latest],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getCOEResultsByPeriod = async (
  period?: string,
): Promise<COEResult[]> => {
  const url = period ? `${API_URL}/coe?period=${period}` : `${API_URL}/coe`;
  return fetchApi<COEResult[]>(url, {
    next: {
      tags: [
        RevalidateTags.COE,
        ...(period ? [`${RevalidateTags.COE}:${period}`] : []),
      ],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getPQPData = async (): Promise<Record<string, Pqp.Rates>> => {
  return fetchApi<Record<string, Pqp.Rates>>(`${API_URL}/coe/pqp`, {
    next: {
      tags: [RevalidateTags.COE, "pqp"],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getLatestCOEMonth = async (): Promise<{ month: string }> => {
  return fetchApi<{ month: string }>(`${API_URL}/coe/months/latest`, {
    next: {
      tags: [RevalidateTags.Latest, RevalidateTags.Reference, "coe"],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getCOEMonthsList = async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/coe/months`, {
    next: {
      tags: [RevalidateTags.Reference, "coe"],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getCOEMarketShareData = async (
  period?: string,
): Promise<COEMarketShareResponse> => {
  const results = await getCOEResultsByPeriod(period);

  if (!results.length) {
    throw new Error("No COE results available for the specified period");
  }

  const totalQuota = results.reduce((sum, result) => sum + result.quota, 0);

  const marketShareData = results.map((result, index) => ({
    category: result.vehicle_class,
    premium: result.premium,
    percentage: (result.quota / totalQuota) * 100,
    quota: result.quota,
    colour: COE_CHART_COLOURS[index % COE_CHART_COLOURS.length],
  }));

  const highestPremium = results.reduce((max, current) =>
    current.premium > max.premium ? current : max,
  );

  return {
    period: results[0].month,
    totalQuota,
    data: marketShareData,
    highestPremium: {
      category: highestPremium.vehicle_class,
      premium: highestPremium.premium,
    },
  };
};

export const getCOETrendData = async (): Promise<COETrendData[]> => {
  const results = await getCOEResults();

  const groupedByPeriod = results.reduce(
    (acc, result) => {
      const period = result.month;
      if (!acc[period]) {
        acc[period] = [];
      }
      acc[period].push(result);
      return acc;
    },
    {} as Record<string, COEResult[]>,
  );

  return Object.entries(groupedByPeriod).map(([period, periodResults]) => ({
    period,
    categories: periodResults.map((result) => ({
      category: result.vehicle_class,
      premium: result.premium,
      quota: result.quota,
      bidsReceived: result.bids_received,
    })),
  }));
};

export const getCOEComparisonData = async (
  currentPeriod: string,
  previousPeriod: string,
): Promise<COEComparisonMetrics> => {
  const [current, previous] = await Promise.all([
    getCOEResultsByPeriod(currentPeriod),
    getCOEResultsByPeriod(previousPeriod),
  ]);

  const currentAvg =
    current.reduce((sum, r) => sum + r.premium, 0) / current.length;
  const previousAvg =
    previous.reduce((sum, r) => sum + r.premium, 0) / previous.length;
  const averagePremiumChange = currentAvg - previousAvg;

  const categoryChanges = current.map((currentResult) => {
    const previousResult = previous.find(
      (p) => p.vehicle_class === currentResult.vehicle_class,
    );
    const previousPremium = previousResult?.premium || 0;
    const change = currentResult.premium - previousPremium;
    const changePercent =
      previousPremium > 0 ? (change / previousPremium) * 100 : 0;

    return {
      category: currentResult.vehicle_class,
      current: currentResult.premium,
      previous: previousPremium,
      change,
      changePercent,
    };
  });

  return {
    currentPeriod: current,
    previousPeriod: previous,
    averagePremiumChange,
    categoryChanges,
  };
};
