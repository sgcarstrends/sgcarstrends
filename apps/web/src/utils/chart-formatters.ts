import { formatCurrency } from "@web/utils/format-currency";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-SG").format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatCount = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatGrowthRate = (value: number): string => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

export const formatMonthYear = (monthString: string): string => {
  return formatDateToMonthYear(monthString);
};

// Standard chart color palette for consistency
export const chartColorPalette = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // rose
  "#06b6d4", // cyan
  "#6366f1", // indigo
  "#f97316", // orange
  "#14b8a6", // teal
  "#84cc16", // lime
] as const;

export const getColorForIndex = (index: number): string => {
  return chartColorPalette[index % chartColorPalette.length];
};

export const chartCategories = {
  primary: "#3b82f6",
  secondary: "#10b981",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
} as const;

export const createDataFormatter = (
  formatType: "number" | "percentage" | "currency" | "count" | "growth",
) => {
  return (value: number) => {
    switch (formatType) {
      case "number":
        return formatNumber(value);
      case "percentage":
        return formatPercentage(value);
      case "currency":
        return formatCurrency(value);
      case "count":
        return formatCount(value);
      case "growth":
        return formatGrowthRate(value);
      default:
        return value.toString();
    }
  };
};

export const customTooltipFormatter = (
  value: number,
  name: string,
  formatType:
    | "number"
    | "percentage"
    | "currency"
    | "count"
    | "growth" = "number",
) => {
  const formatter = createDataFormatter(formatType);
  return [formatter(value), name];
};
