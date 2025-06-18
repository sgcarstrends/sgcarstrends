// Reexport all types from @sgcarstrends/types
export type {
  Car,
  COE,
  Collection,
  FuelType,
  LatestMonth,
  OrderBy,
  PQP,
  VehicleClass,
} from "@sgcarstrends/types";

// Local types that aren't shared
export type Make = string;

// Workflow types
export enum Stage {
  DEVELOPMENT = "dev",
  STAGING = "staging",
  PRODUCTION = "prod",
}
