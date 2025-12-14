import { loadLastUpdated } from "@web/lib/common";
import {
  getCarMarketShareData,
  getCarsComparison,
  getCarsData,
  getFuelTypeData,
  getTopMakesByFuelType,
  getTopTypes,
  getVehicleTypeData,
} from "@web/queries/cars";
import { fetchMonthsForCars } from "@web/utils/months";

/**
 * Load data for cars category pages (fuel-types or vehicle-types)
 *
 * @param month - Month in YYYY-MM format
 * @param apiDataField - Category field to fetch market share for
 * @returns Category page data with cars, top performers, market share, months, and last updated
 */
export const loadCarsCategoryPageData = async (
  month: string,
  apiDataField: "fuelType" | "vehicleType",
) => {
  const [
    lastUpdated,
    cars,
    marketShare,
    months,
    comparison,
    topMakesByFuelType,
  ] = await Promise.all([
    loadLastUpdated("cars"),
    getCarsData(month),
    getCarMarketShareData(month, apiDataField),
    fetchMonthsForCars(),
    getCarsComparison(month),
    // Only fetch top makes by fuel type for fuel-types category
    apiDataField === "fuelType"
      ? getTopMakesByFuelType(month)
      : Promise.resolve([]),
  ]);

  const previousTotal = comparison.previousMonth?.total ?? null;

  return {
    lastUpdated,
    cars,
    marketShare,
    months,
    previousTotal,
    topMakesByFuelType,
  };
};

/**
 * Type definition for fuel/vehicle type data
 */
export interface TypeData {
  total: number;
  data: {
    month: string;
    make: string;
    fuelType?: string;
    vehicleType?: string;
    count: number;
  }[];
}

/**
 * Load data for specific car type pages (fuel-type or vehicle-type detail)
 *
 * @param category - Category type ('fuel-types' or 'vehicle-types')
 * @param type - Specific type slug
 * @param month - Month in YYYY-MM format
 * @returns Type-safe data for the specific type page
 */
export const loadCarsTypePageData = async (
  category: string,
  type: string,
  month: string,
): Promise<{
  cars: TypeData;
  months: string[];
  lastUpdated: number | null;
}> => {
  const [cars, months, lastUpdated] = await Promise.all([
    category === "fuel-types"
      ? getFuelTypeData(type, month)
      : getVehicleTypeData(type, month),
    fetchMonthsForCars(),
    loadLastUpdated("cars"),
  ]);

  return { cars, months, lastUpdated };
};

/**
 * Load metadata data for cars overview page
 *
 * @param month - Month in YYYY-MM format
 * @returns Top types and car registration data for metadata generation
 */
export const loadCarsMetadataData = async (month: string) => {
  const [topTypes, carRegistration] = await Promise.all([
    getTopTypes(month),
    getCarsData(month),
  ]);

  return { topTypes, carRegistration };
};
