import type { SelectDeregistration } from "@sgcarstrends/database";
import { chartColourPalette } from "@web/utils/charts";

export const DEREGISTRATION_CATEGORIES = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Vehicles Exempted From VQS",
  "Taxis",
] as const;

export const DEREGISTRATION_CATEGORY_COLOURS: Record<string, string> = {
  "Category A": chartColourPalette[0],
  "Category B": chartColourPalette[1],
  "Category C": chartColourPalette[2],
  "Category D": chartColourPalette[3],
  "Vehicles Exempted From VQS": chartColourPalette[4],
  Taxis: chartColourPalette[5],
};

export const getCategoryColour = (category: string): string => {
  return DEREGISTRATION_CATEGORY_COLOURS[category] ?? chartColourPalette[0];
};

export interface MonthlyTotal {
  month: string;
  total: number;
}

export const toMonthlyTotals = (
  data: SelectDeregistration[],
): MonthlyTotal[] => {
  const grouped = data.reduce<Record<string, number>>((acc, record) => {
    acc[record.month] = (acc[record.month] ?? 0) + (record.number ?? 0);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export interface CategorySparklineData {
  category: string;
  total: number;
  trend: { value: number }[];
  colour: string;
}

export const toCategorySparklines = (
  data: SelectDeregistration[],
  currentMonthCategories: { category: string; total: number }[],
  monthCount = 12,
): CategorySparklineData[] => {
  const sortedMonths = [...new Set(data.map((record) => record.month))].sort();
  const recentMonths = sortedMonths.slice(-monthCount);

  return currentMonthCategories.map(({ category, total }) => {
    const trend = recentMonths.map((month) => {
      const monthRecords = data.filter(
        (record) => record.month === month && record.category === category,
      );
      const value = monthRecords.reduce(
        (sum, record) => sum + (record.number ?? 0),
        0,
      );
      return { value };
    });

    return {
      category,
      total,
      trend,
      colour: getCategoryColour(category),
    };
  });
};

export interface CategoryWithPercentage {
  category: string;
  total: number;
  percentage: number;
  colour: string;
}

export const toPercentageDistribution = (
  data: { category: string; total: number }[],
): CategoryWithPercentage[] => {
  const grandTotal = data.reduce((sum, item) => sum + item.total, 0);

  return data.map((item) => ({
    ...item,
    percentage: grandTotal > 0 ? (item.total / grandTotal) * 100 : 0,
    colour: getCategoryColour(item.category),
  }));
};
