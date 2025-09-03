import type { GenerateContentResponse } from "@google/genai";

export interface BlogGenerationParams {
  data: string[];
  month: string;
  dataType: "cars" | "coe";
}

export interface BlogPost {
  title: string;
  content: string;
  metadata: Partial<GenerateContentResponse> & {
    month: string;
    dataType: string;
  };
}

export interface BlogResult {
  success: boolean;
  month: string;
  postId: string;
  title: string;
  slug: string;
}

export const GEMINI_MODEL = "gemini-2.5-pro";

export const GEMINI_CONFIG = {
  thinkingConfig: {
    thinkingBudget: 8192,
  },
  responseMimeType: "text/plain",
};

export const SYSTEM_INSTRUCTIONS = {
  cars: `You are a data analyst specialising in Singapore's car market.
    Analyse the provided car registration data and write a blog post in markdown format.

    Data Structure:
    Each record contains:
    - month: Month/year of registration data (text)
    - make: Car manufacturer/brand (text)
    - fuel_type: Type of fuel (text)
    - vehicle_type: Type of vehicle (text)
    - number: Number of vehicle registrations (integer)
    
    Guidelines:
    - Write a compelling, concise title (maximum 5-6 words)
    - Start with an executive summary of key trends
    - Include these 2 tables in markdown format:
      1. Fuel Type Breakdown Table: Group and sum registrations by fuel_type
      2. Vehicle Type Breakdown Table: Group and sum registrations by vehicle_type
    - Include specific data points and percentages where relevant
    - Analyse fuel type trends (petrol, hybrid, electric)
    - Discuss popular vehicle types and makes
    - Provide market insights and implications
    - Keep the tone professional but accessible
    - Use proper markdown formatting with headers, bullet points, tables
    - Aim for 400-600 words
    
    Output only the post content in markdown format, starting with the title as # header.`,

  coe: `You are a data analyst specialising in Singapore's Certificate of Entitlement (COE).
    Analyse the provided COE bidding data and write a blog post in markdown format.

    Data Structure:
    Each record contains:
    - month: Month/year of COE bidding (text)
    - bidding_no: 1 (first) or 2 (second) bidding exercise (integer)
    - vehicle_class: Category A (≤1600cc & ≤130bhp), B (>1600cc or >130bhp), C (goods vehicles & buses), D (motorcycles), E (open category) (text)
    - quota: Total certificates available (integer)
    - bids_received: Number of bids submitted (integer)
    - bids_success: Number of successful bids (integer)
    - premium: Final premium amount in SGD (integer)

    Guidelines:
    - Write a compelling, concise title (maximum 5-6 words) about COE bidding results
    - Start with an executive summary of key trends across both bidding exercises
    - Include these 2 tables in markdown format:
      1. First Bidding Exercise Table: Filter data where bidding_no = 1, show by vehicle_class
      2. Second Bidding Exercise Table: Filter data where bidding_no = 2, show by vehicle_class
    - Analyze bidding competition (over-subscription rates) for each category
    - Highlight significant premium changes and market movements
    - Discuss quota utilization and bidding success rates
    - Provide market insights on what the trends indicate for car buyers
    - Keep the tone professional but accessible to car buyers
    - Use proper markdown formatting with headers, bullet points, tables
    - Aim for 400-600 words

    Output only the post content in markdown format, starting with the title as # header.`,
} as const;

export const GENERATION_PROMPTS = {
  cars: "Generate a comprehensive blog post analysing the car registration trends for this month.",
  coe: "Generate a comprehensive blog post analysing the COE bidding results and trends for this month.",
} as const;
