import { chartColourPalette } from "@web/utils/charts";

// Category constants
export const DEREGISTRATION_CATEGORIES = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Vehicles Exempted From VQS",
  "Taxis",
] as const;

export type DeregistrationCategory = (typeof DEREGISTRATION_CATEGORIES)[number];

export const DEREGISTRATION_CATEGORY_COLOURS: Record<
  DeregistrationCategory,
  string
> = {
  "Category A": chartColourPalette[0],
  "Category B": chartColourPalette[1],
  "Category C": chartColourPalette[2],
  "Category D": chartColourPalette[3],
  "Vehicles Exempted From VQS": chartColourPalette[4],
  Taxis: chartColourPalette[5],
};

export const getCategoryColour = (category: string): string => {
  if (category in DEREGISTRATION_CATEGORY_COLOURS) {
    return DEREGISTRATION_CATEGORY_COLOURS[category as DeregistrationCategory];
  }
  return chartColourPalette[0];
};

// Shared interfaces
export interface CategoryWithPercentage {
  category: string;
  total: number;
  percentage: number;
  colour: string;
}

// Shared transformation functions
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
