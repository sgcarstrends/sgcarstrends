import type { CarMarketShareData } from "@web/queries/cars";
import { format, subMonths } from "date-fns";

export const calculateCarMarketShareInsights = (
  data: CarMarketShareData[],
): {
  diversity: number;
  concentration: number;
  top3Share: number;
  insights: string[];
} => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const diversity = data.length;
  const concentration = sortedData[0]?.percentage || 0;
  const top3Share = sortedData
    .slice(0, 3)
    .reduce((sum, item) => sum + item.percentage, 0);

  const insights: string[] = [];

  if (concentration > 50) {
    insights.push(
      `${sortedData[0].name} dominates with ${concentration.toFixed(1)}% market share`,
    );
  }

  if (top3Share > 80) {
    insights.push("Market is highly concentrated amongst top 3 categories");
  } else if (top3Share < 60) {
    insights.push("Market shows good diversity across categories");
  }

  if (diversity > 6) {
    insights.push("High category diversity in registrations");
  }

  return {
    diversity,
    concentration,
    top3Share,
    insights,
  };
};

export const formatCarMarketShareForChart = (
  data: CarMarketShareData[],
): Array<{
  name: string;
  value: number;
  colour: string;
}> => {
  return data.map((item) => ({
    name: item.name,
    value: item.count,
    colour: item.colour,
  }));
};

export const getRankingEmoji = (rank: number): string => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
};

/**
 * Get previous month and previous year month strings for comparison
 */
export const getComparisonMonths = (
  month: string,
): { previousMonthStr: string; previousYearStr: string } => {
  const currentDate = new Date(`${month}-01`);
  const previousMonthDate = subMonths(currentDate, 1);
  const previousYearDate = subMonths(currentDate, 12);

  return {
    previousMonthStr: format(previousMonthDate, "yyyy-MM"),
    previousYearStr: format(previousYearDate, "yyyy-MM"),
  };
};

interface CategoryData {
  name: string;
  count: number;
}

/**
 * Calculate market share data with percentages and colours
 */
export const calculateMarketShareData = (
  categoryData: CategoryData[],
  total: number,
): CarMarketShareData[] => {
  return categoryData.map((item, index) => ({
    name: item.name,
    count: item.count,
    percentage: (item.count / total) * 100,
    colour: `var(--chart-${index + 1})`,
  }));
};

/**
 * Find the dominant type from market share data
 */
export const findDominantType = (
  data: CarMarketShareData[],
): { name: string; percentage: number } => {
  const dominant = data.reduce(
    (max, current) => (current.percentage > max.percentage ? current : max),
    data[0] ?? {
      name: "Unknown",
      percentage: 0,
      count: 0,
      colour: "var(--chart-1)",
    },
  );

  return {
    name: dominant.name,
    percentage: dominant.percentage,
  };
};

interface TopTypeData {
  name: string;
  total: number;
}

/**
 * Calculate top performers data with rankings and percentages
 */
export const calculateTopPerformersData = (
  topFuelType: TopTypeData,
  topVehicleType: TopTypeData,
  topMakes: Array<{ make: string; total: number }>,
  total: number,
) => {
  const topFuelTypes = [
    {
      name: topFuelType.name,
      count: topFuelType.total,
      percentage: (topFuelType.total / total) * 100,
      rank: 1,
    },
  ];

  const topVehicleTypes = [
    {
      name: topVehicleType.name,
      count: topVehicleType.total,
      percentage: (topVehicleType.total / total) * 100,
      rank: 1,
    },
  ];

  const topMakesData = topMakes.map((make, index) => ({
    make: make.make,
    count: make.total,
    percentage: (make.total / total) * 100,
    rank: index + 1,
  }));

  return { topFuelTypes, topVehicleTypes, topMakes: topMakesData };
};
