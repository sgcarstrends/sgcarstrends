import { API_URL } from "@web/config";
import type { COEResult, PQP } from "@web/types";
import { RevalidateTags } from "@web/types";
import { CACHE_DURATION, fetchApi } from "@web/utils/fetch-api";
import { cache } from "react";

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

// Chart color palette for COE data
export const COE_CHART_COLOURS = [
  "#dc2626", // red for Category A
  "#ea580c", // orange for Category B
  "#ca8a04", // yellow for Category C
  "#16a34a", // green for Category D
  "#2563eb", // blue for Category E
  "#9333ea", // purple for Open
] as const;

// COE category mapping
export const COE_CATEGORY_MAP = {
  A: "Category A (Cars up to 1600cc & 130bhp)",
  B: "Category B (Cars above 1600cc or 130bhp)",
  C: "Category C (Goods vehicles & buses)",
  D: "Category D (Motorcycles)",
  E: "Category E (Open category)",
} as const;

// ========== CACHED API FUNCTIONS ==========

/**
 * Cached COE results data fetcher
 */
export const getCOEResults = cache(async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe`, {
    next: {
      tags: [RevalidateTags.COE],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached latest COE results data fetcher
 */
export const getLatestCOEResults = cache(async (): Promise<COEResult[]> => {
  return fetchApi<COEResult[]>(`${API_URL}/coe/latest`, {
    next: {
      tags: [RevalidateTags.COE, RevalidateTags.Latest],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached COE results by period fetcher
 */
export const getCOEResultsByPeriod = cache(
  async (period?: string): Promise<COEResult[]> => {
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
  },
);

/**
 * Cached PQP (Prevailing Quota Premium) data fetcher
 */
export const getPQPData = cache(async (): Promise<Record<string, PQP>> => {
  return fetchApi<Record<string, PQP>>(`${API_URL}/coe/pqp`, {
    next: {
      tags: [RevalidateTags.COE, "pqp"],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached latest month data fetcher for COE
 */
export const getLatestCOEMonth = cache(async (): Promise<{ month: string }> => {
  return fetchApi<{ month: string }>(`${API_URL}/coe/months/latest`, {
    next: {
      tags: [RevalidateTags.Latest, RevalidateTags.Reference, "coe"],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached months list fetcher for COE
 */
export const getCOEMonthsList = cache(async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/coe/months`, {
    next: {
      tags: [RevalidateTags.Reference, "coe"],
      revalidate: CACHE_DURATION,
    },
  });
});

// ========== COMPUTED DATA FUNCTIONS ==========

/**
 * Cached COE market share data processor
 */
export const getCOEMarketShareData = cache(
  async (period?: string): Promise<COEMarketShareResponse> => {
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
  },
);

/**
 * Cached COE trend data processor
 */
export const getCOETrendData = cache(async (): Promise<COETrendData[]> => {
  const results = await getCOEResults();

  // Group by month
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
});

/**
 * Cached COE comparison data processor
 */
export const getCOEComparisonData = cache(
  async (
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
  },
);

// ========== UTILITY FUNCTIONS ==========

/**
 * Format COE category name for display
 */
export const formatCOECategory = (category: string): string => {
  return (
    COE_CATEGORY_MAP[category as keyof typeof COE_CATEGORY_MAP] || category
  );
};

/**
 * Calculate COE premium insights
 */
export const calculateCOEPremiumInsights = (
  data: COEMarketShareData[],
): {
  averagePremium: number;
  highestCategory: string;
  lowestCategory: string;
  premiumSpread: number;
  insights: string[];
} => {
  const sortedByPremium = [...data].sort((a, b) => b.premium - a.premium);

  const averagePremium =
    data.reduce((sum, item) => sum + item.premium, 0) / data.length;
  const highestCategory = sortedByPremium[0];
  const lowestCategory = sortedByPremium[sortedByPremium.length - 1];
  const premiumSpread = highestCategory.premium - lowestCategory.premium;

  const insights: string[] = [];

  if (premiumSpread > 50000) {
    insights.push(
      `Large premium spread of $${Math.round(premiumSpread).toLocaleString()} between categories`,
    );
  }

  if (highestCategory.premium > averagePremium * 1.5) {
    insights.push(
      `${highestCategory.category} trading significantly above average`,
    );
  }

  if (lowestCategory.premium < averagePremium * 0.5) {
    insights.push(
      `${lowestCategory.category} trading significantly below average`,
    );
  }

  return {
    averagePremium,
    highestCategory: highestCategory.category,
    lowestCategory: lowestCategory.category,
    premiumSpread,
    insights,
  };
};

/**
 * Format COE data for chart visualization
 */
export const formatCOEDataForChart = (
  data: COEMarketShareData[],
): Array<{
  name: string;
  value: number;
  premium: number;
  colour: string;
}> => {
  return data.map((item) => ({
    name: formatCOECategory(item.category),
    value: item.quota,
    premium: item.premium,
    colour: item.colour,
  }));
};

/**
 * Get COE category color
 */
export const getCOECategoryColor = (category: string): string => {
  const categoryIndex = Object.keys(COE_CATEGORY_MAP).indexOf(
    category.toUpperCase(),
  );
  return categoryIndex >= 0
    ? COE_CHART_COLOURS[categoryIndex]
    : COE_CHART_COLOURS[0];
};
