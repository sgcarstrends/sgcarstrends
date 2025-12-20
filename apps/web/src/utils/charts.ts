import { formatCurrency } from "@web/utils/format-currency";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-SG").format(value);
};

/**
 * Format a percentage value (already in 0-100 range) to string with 1 decimal place
 * @param value - Percentage value (e.g., 25.5)
 * @returns Formatted string (e.g., "25.5%")
 * @example formatPercentage(25.5) // returns "25.5%"
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format a decimal value (0-1 range) as a percentage string using Intl.NumberFormat
 * @param value - Decimal value (e.g., 0.255)
 * @param options - Optional Intl.NumberFormat options
 * @returns Formatted percentage string (e.g., "25.5%")
 * @example formatPercent(0.255) // returns "26%" (rounded by default)
 */
export const formatPercent = (
  value: number | bigint,
  options?: Intl.NumberFormatOptions | undefined,
): string => {
  return new Intl.NumberFormat("en-SG", {
    style: "percent",
    ...options,
  }).format(value);
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
