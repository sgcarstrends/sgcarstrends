import { API_DOMAINS, SITE_DOMAINS } from "@api/config/domains";

export const WORKFLOWS_BASE_URL = `https://${API_DOMAINS[process.env.STAGE as keyof typeof API_DOMAINS]}/workflows`;
export const SITE_URL = `https://${SITE_DOMAINS[process.env.STAGE as keyof typeof SITE_DOMAINS]}`;

export const CACHE_TTL = 24 * 60 * 60;

export const AWS_LAMBDA_TEMP_DIR = "/tmp";
export const LTA_DATAMALL_BASE_URL =
  "https://datamall.lta.gov.sg/content/dam/datamall/datasets/Facts_Figures/Vehicle Registration";
