import type { Stage } from "@api/updater/types";
import { Resource } from "sst";

export const DOMAIN_NAME = "sgcarstrends.com";
export const API_DOMAINS: Record<Stage, string> = {
  dev: `dev.api.${DOMAIN_NAME}`,
  staging: `staging.api.${DOMAIN_NAME}`,
  prod: `api.${DOMAIN_NAME}`,
};
export const UPDATER_BASE_URL = `https://${API_DOMAINS[Resource.App.stage]}/updater`;

export const SITE_DOMAINS: Record<Stage, string> = {
  dev: `dev.${DOMAIN_NAME}`,
  staging: `staging.${DOMAIN_NAME}`,
  prod: DOMAIN_NAME,
};
export const SITE_URL = `https://${SITE_DOMAINS[Resource.App.stage]}`;

export const CACHE_TTL = 24 * 60 * 60;

export const AWS_LAMBDA_TEMP_DIR = "/tmp";
export const LTA_DATAMALL_BASE_URL =
  "https://datamall.lta.gov.sg/content/dam/datamall/datasets/Facts_Figures/Vehicle Registration";
