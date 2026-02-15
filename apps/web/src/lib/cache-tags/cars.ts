export const getCarsMonthlyRevalidationTags = (month: string): string[] => {
  const year = month.split("-")[0];

  return [
    `cars:month:${month}`,
    "cars:months",
    "cars:makes",
    "cars:annual",
    "cars:top-makes",
    `cars:year:${year}`,
  ];
};
