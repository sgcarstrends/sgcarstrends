import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const ogSearchParams = {
  month: parseAsString,
  title: parseAsString,
  subtitle: parseAsString,
  total: parseAsInteger,
  topFuelType: parseAsString,
  topFuelValue: parseAsInteger,
  topVehicleType: parseAsString,
  topVehicleValue: parseAsInteger,
};

export const loadSearchParams = createLoader(ogSearchParams);
