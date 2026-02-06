export const getDeregistrationsMonthlyRevalidationTags = (
  month: string,
): string[] => {
  const year = month.split("-")[0];

  return [
    `deregistrations:month:${month}`,
    "deregistrations:months",
    `deregistrations:year:${year}`,
  ];
};
