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

export const formatDateToMonthYear = (dateString: string): string => {
  // After splitting the year and month, convert them to numbers right away
  const [year, month] = dateString.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
};
