import type { CoeMarketShareData } from "@web/queries/coe";
import type { COEBiddingResult, COEResult } from "@web/types";

export const COE_CHART_COLOURS = [
  "#dc2626", // red for Category A
  "#ea580c", // orange for Category B
  "#ca8a04", // yellow for Category C
  "#16a34a", // green for Category D
  "#2563eb", // blue for Category E
  "#9333ea", // purple for Open
] as const;

export const COE_CATEGORY_MAP = {
  A: "Category A (Cars up to 1600cc & 130bhp)",
  B: "Category B (Cars above 1600cc or 130bhp)",
  C: "Category C (Goods vehicles & buses)",
  D: "Category D (Motorcycles)",
  E: "Category E (Open category)",
} as const;

export const formatCOECategory = (category: string): string => {
  return (
    COE_CATEGORY_MAP[category as keyof typeof COE_CATEGORY_MAP] || category
  );
};

export const calculateCOEPremiumInsights = (
  data: CoeMarketShareData[],
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

export const formatCOEDataForChart = (
  data: CoeMarketShareData[],
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
 * Groups COE results by month and bidding number, transforming from
 * separate records per vehicle class into a single record with all
 * categories as fields.
 */
export const groupCOEResultsByBidding = (
  coeResults: COEResult[],
): COEBiddingResult[] => {
  const groupedData = coeResults.reduce<
    Record<string, Partial<COEBiddingResult>>
  >((acc, item) => {
    const key = `${item.month}-${item.biddingNo}`;

    if (!acc[key]) {
      acc[key] = {
        month: item.month,
        biddingNo: item.biddingNo,
      };
    }
    acc[key][item.vehicleClass] = item.premium;

    return acc;
  }, {});

  return Object.values(groupedData) as COEBiddingResult[];
};

export interface TrendInsight {
  category: string;
  latest: number;
  change: number;
  highest: number;
  lowest: number;
  average: number;
}

/**
 * Calculate trend insights for COE categories.
 * Analyzes latest prices, percentage changes, and historical statistics per category.
 */
export const calculateTrendInsights = (
  data: COEBiddingResult[],
): TrendInsight[] => {
  const categories = [
    "Category A",
    "Category B",
    "Category C",
    "Category D",
    "Category E",
  ];

  return categories
    .map((category) => {
      const categoryData = data
        .filter((item) => item[category as keyof COEBiddingResult])
        .map((item) => ({
          month: item.month,
          premium: item[category as keyof COEBiddingResult] as number,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      if (categoryData.length === 0) return null;

      const latest = categoryData[categoryData.length - 1];
      const previous = categoryData[categoryData.length - 2];
      const change = previous
        ? ((latest.premium - previous.premium) / previous.premium) * 100
        : 0;

      const highest = Math.max(...categoryData.map((d) => d.premium));
      const lowest = Math.min(...categoryData.map((d) => d.premium));
      const average =
        categoryData.reduce((sum, d) => sum + d.premium, 0) /
        categoryData.length;

      return {
        category,
        latest: latest.premium,
        change,
        highest,
        lowest,
        average,
      };
    })
    .filter((x) => x !== null) as TrendInsight[];
};

export interface CategoryStats {
  totalRounds: number;
  averagePremium: number;
  highestPremium: number;
  lowestPremium: number;
}

/**
 * Calculate statistics for a specific COE category.
 */
export const calculateCategoryStats = (results: COEResult[]): CategoryStats => {
  const premiums = results.map((item) => item.premium);

  return {
    totalRounds: results.length,
    averagePremium: Math.round(
      premiums.reduce((sum, p) => sum + p, 0) / premiums.length,
    ),
    highestPremium: Math.max(...premiums),
    lowestPremium: Math.min(...premiums),
  };
};

export interface OverviewStats {
  category: string;
  highest: number;
  lowest: number;
  highestRecord: {
    date?: string;
    amount: number;
  };
  lowestRecord: {
    date?: string;
    amount: number;
  };
}

/**
 * Calculate overview statistics for COE categories across all data.
 * Returns highest/lowest premiums with dates for specified categories.
 */
export const calculateOverviewStats = (
  allResults: COEResult[],
  categories: string[],
): OverviewStats[] => {
  return categories
    .map((category) => {
      const categoryData = allResults
        .filter((item) => item.vehicleClass === category)
        .sort(
          (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
        );

      if (categoryData.length === 0) return null;

      const premiums = categoryData.map(({ premium }) => premium);
      const highest = Math.max(...premiums);
      const lowest = Math.min(...premiums);

      const highestRecord = categoryData.find(
        ({ premium }) => premium === highest,
      );
      const lowestRecord = categoryData.find(
        ({ premium }) => premium === lowest,
      );

      return {
        category,
        highest,
        lowest,
        highestRecord: {
          date: highestRecord?.month,
          amount: highest,
        },
        lowestRecord: {
          date: lowestRecord?.month,
          amount: lowest,
        },
      };
    })
    .filter((x) => x !== null) as OverviewStats[];
};
