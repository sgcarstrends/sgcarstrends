import { FUEL_TYPE } from "@web/config";
import type { LucideIcon } from "lucide-react";

export type VehicleType =
  | "Coupe/ Convertible"
  | "Hatchback"
  | "Multi-purpose Vehicle"
  | "Multi-purpose Vehicle/Station-wagon"
  | "Sedan"
  | "Sports Utility Vehicle"
  | "Station-wagon";

export interface Car {
  month: string;
  make: string;
  importer_type?: string;
  fuel_type: FUEL_TYPE;
  vehicle_type: VehicleType;
  number: number;
  selected?: boolean;
}

export type Dataset = {
  name: string;
  data: number[];
};

export interface ChartDataset extends Dataset {
  checked: boolean;
}

export interface TabItem {
  title: string;
  href: string;
}

export type COECategory =
  | "Category A"
  | "Category B"
  | "Category C"
  | "Category D"
  | "Category E";
export type COECategoryFilter = Record<COECategory, boolean>;

export interface COEResult {
  month: string;
  bidding_no: number;
  vehicle_class: COECategory;
  quota: number;
  bids_success: number;
  bids_received: number;
  premium: number;
}

export type PQP = {
  "Category A": number;
  "Category B": number;
  "Category C": number;
  "Category D": number;
};

export interface LatestMonth {
  cars: string;
  coe: string;
}

export interface COEBiddingResult {
  month: string;
  biddingNo: number;
  "Category A": number;
  "Category B": number;
  "Category C": number;
  "Category D": number;
  "Category E": number;
}

export enum RevalidateTags {
  // Core data types
  Cars = "cars",
  COE = "coe",

  // Time-based tags
  Latest = "latest",
  Monthly = "monthly",

  // Feature-based tags
  Analysis = "analysis",
  Comparison = "comparison",
  MarketShare = "market-share",
  TopPerformers = "top-performers",
  Reference = "reference",

  // Legacy compatibility
  API = "api",
}

export type Make = Car["make"];

export type Month = Car["month"] | COEResult["month"];

export enum AppEnv {
  DEV = "dev",
  STAGING = "staging",
  PROD = "prod",
}

export interface LinkItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
}

export * from "./blog";

export interface TypeItem {
  name: string;
  count: number;
}

export interface CategoryData {
  month: string;
  total: number;
  fuelType: TypeItem[];
  vehicleType: TypeItem[];
}

export interface TrendPoint {
  month: string;
  total: number;
  [key: string]: number | string;
}

export interface MarketInsight {
  title: string;
  value: string | number;
  delta?: number;
  deltaType?: "increase" | "decrease" | "unchanged";
  description?: string;
}
