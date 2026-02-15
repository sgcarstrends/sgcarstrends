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
