import type { COEMarketShareData } from "@web/lib/data/coe";

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

export const getCOECategoryColor = (category: string): string => {
  const categoryIndex = Object.keys(COE_CATEGORY_MAP).indexOf(
    category.toUpperCase(),
  );
  return categoryIndex >= 0
    ? COE_CHART_COLOURS[categoryIndex]
    : COE_CHART_COLOURS[0];
};
