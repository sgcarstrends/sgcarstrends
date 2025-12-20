import { VEHICLE_TYPE_MAP } from "@web/constants";

export const formatVehicleType = (type: string): string => {
  return VEHICLE_TYPE_MAP[type] ?? type;
};

// Mapping from slugified URL parameters to display names
const SLUG_TO_VEHICLE_TYPE: Record<string, string> = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  "multi-purpose-vehicle": "MPV",
  "multi-purpose-vehicle-station-wagon": "MPV",
  "station-wagon": "Station wagon",
  "sports-utility-vehicle": "SUV",
  "coupe-convertible": "Coupe/Convertible",
};

export const formatVehicleTypeSlug = (slug: string): string => {
  return SLUG_TO_VEHICLE_TYPE[slug] ?? slug;
};
