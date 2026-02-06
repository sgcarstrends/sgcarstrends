export const getCoeMonthlyRevalidationTags = (
  month: string,
  year: string,
): string[] => {
  return [
    "coe:latest",
    "coe:previous",
    "coe:months",
    "coe:results",
    "coe:trends",
    "coe:bidding-rounds",
    `coe:month:${month}`,
    `coe:year:${year}`,
  ];
};
