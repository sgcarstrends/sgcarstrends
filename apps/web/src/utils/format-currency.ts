/**
 * Base number formatter for Singapore locale.
 * Shared by formatCurrency and AnimatedNumber.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-SG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as Singapore Dollars (SGD).
 * Uses Intl.NumberFormat for proper sign handling.
 * @example formatCurrency(95000) // returns "$95,000"
 * @example formatCurrency(-1000) // returns "-$1,000"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
