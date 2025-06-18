import { FuelType, VehicleType } from "@sgcarstrends/types";

export const CACHE_TTL = 24 * 60 * 60;

export * from "./platforms";
export * from "./qstash";
// Re-export workflow configs
export * from "./workflow";

/**
 * Regular expression to match strings in the following formats:
 * - Diesel-Electric
 * - Diesel-Electric (Plug-In)
 * - Petrol-Electric
 * - Petrol-Electric (Plug-In)
 *
 * The pattern breakdown is as follows:
 * - `^` asserts the start of the string.
 * - `(${FuelType.Diesel}|${FuelType.Petrol})` matches either "Diesel" or "Petrol".
 * - `-` matches the hyphen character literally.
 * - `${FuelType.Electric}` matches the string "Electric".
 * - `(\\s\\(Plug-In\\))?` matches an optional space followed by "(Plug-In)".
 * - `$` asserts the end of the string.
 * - `"i"` makes the regular expression case-insensitive.
 */
export const HYBRID_REGEX = new RegExp(
  `^(${FuelType.Diesel}|${FuelType.Petrol})-${FuelType.Electric}(\\s\\(Plug-In\\))?$`,
  "i",
);

export const MPV_REGEX = new RegExp(
  `^(${VehicleType.MultiPurposeVehicle}|${VehicleType.MultiPurposeVehicle}/${VehicleType.StationWagon})$`,
  "i",
);
