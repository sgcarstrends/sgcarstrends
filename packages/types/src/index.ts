// Enums
export enum FuelType {
  Diesel = "Diesel",
  Electric = "Electric",
  Hybrid = "Hybrid",
  Petrol = "Petrol",
  Others = "Others",
}

export type VehicleType =
  | "Coupe/ Convertible"
  | "Hatchback"
  | "Multi-purpose Vehicle"
  | "Multi-purpose Vehicle/Station-wagon"
  | "Sedan"
  | "Sports Utility Vehicle"
  | "Station-wagon";

export enum Collection {
  Cars = "cars",
  COE = "coe",
  PQP = "pqp",
  Deregistrations = "deregistrations",
}

export enum OrderBy {
  ASC = "asc",
  DESC = "desc",
}

export type COECategory =
  | "Category A"
  | "Category B"
  | "Category C"
  | "Category D"
  | "Category E";

export enum VehicleClass {
  CategoryA = "Category A",
  CategoryB = "Category B",
  CategoryC = "Category C",
  CategoryD = "Category D",
  CategoryE = "Category E",
}

// Base types
export type Stage = "dev" | "staging" | "prod";

// Common interfaces for data (before database insertion)
export interface Car {
  month: string;
  make: string;
  importerType: string;
  fuelType: string;
  vehicleType: string;
  number: number;
}

export interface COE {
  month: string;
  biddingNo: number;
  vehicleClass: COECategory;
  quota: number;
  bidsSuccess: number;
  bidsReceived: number;
  premium: number;
}

export interface PQP {
  month: string;
  vehicleClass: string;
  pqp: number;
}

export interface Deregistration {
  month: string;
  category: string;
  number: number;
}

export interface CleanSpecialCharsOptions {
  separator?: string;
  joinSeparator?: string;
}
