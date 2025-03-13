import { format, subMonths } from "date-fns";

/**
 * Gets the month from 6 months before the given date string
 *
 * @param dateString - Date string in the format "yyyy-MM"
 * @returns Date string 6 months prior in the format "yyyy-MM"
 */
export const getTrailingSixMonths = (dateString: string): string => {
  const targetDate = new Date(`${dateString}-01`);
  return format(subMonths(targetDate, 5), "yyyy-MM");
};
