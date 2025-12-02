export const CARS_TAGS = [
  "Cars",
  "Registrations",
  "Fuel Types",
  "Vehicle Types",
  "Monthly Update",
  "New Registration",
  "Market Trends",
] as const;

export const COE_TAGS = [
  "COE",
  "Quota Premium",
  "1st Bidding Round",
  "2nd Bidding Round",
  "Monthly Update",
  "PQP",
] as const;

export type CarsTag = (typeof CARS_TAGS)[number];
export type CoeTag = (typeof COE_TAGS)[number];
