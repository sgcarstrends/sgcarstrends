import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getCOELatestMonth } from "@web/queries/coe/latest-month";

interface LatestMonths {
  cars: string | null;
  coe: string | null;
}

/**
 * Get the latest months for both cars and COE data
 * Useful for displaying month selectors or determining the most recent data available
 */
export const getLatestMonths = async (): Promise<LatestMonths> => {
  const [carsMonth, coeMonth] = await Promise.all([
    getCarsLatestMonth(),
    getCOELatestMonth(),
  ]);

  return {
    cars: carsMonth,
    coe: coeMonth,
  };
};

/**
 * Get the latest month across both cars and COE datasets
 * Returns the most recent month between the two
 */
export const getOverallLatestMonth = async (): Promise<string | null> => {
  const { cars, coe } = await getLatestMonths();

  if (!cars && !coe) return null;
  if (!cars) return coe;
  if (!coe) return cars;

  // Return the more recent of the two months
  return cars > coe ? cars : coe;
};
