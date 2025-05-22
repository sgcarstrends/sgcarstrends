import type { Stage } from "@updater/types";
import { Resource } from "sst";

export const DOMAIN_NAME = "updater.sgcarstrends.com";
export const DOMAINS: Record<Stage, string> = {
  dev: `dev.${DOMAIN_NAME}`,
  staging: `staging.${DOMAIN_NAME}`,
  prod: DOMAIN_NAME,
};
export const UPDATER_BASE_URL = `https://${DOMAINS[Resource.App.stage]}`;

export const CACHE_TTL = 24 * 60 * 60;

export const AWS_LAMBDA_TEMP_DIR = "/tmp";
export const LTA_DATAMALL_BASE_URL =
  "https://datamall.lta.gov.sg/content/dam/datamall/datasets/Facts_Figures/Vehicle Registration";
