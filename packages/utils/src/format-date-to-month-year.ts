export const MONTHS: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatDateToMonthYear(dateString: string): string {
  // Handle undefined or empty input
  if (!dateString) {
    return "";
  }

  // After splitting the year and month, convert them to numbers right away
  const [year, month] = dateString.split("-").map(Number);
  if (month === undefined) {
    return "";
  }
  return `${MONTHS[month - 1]} ${year}`;
}
