import { API_DOMAINS, SITE_DOMAINS } from "@api/config/domains";
import { Resource } from "sst";

export const WORKFLOWS_BASE_URL = `https://${API_DOMAINS[Resource.App.stage]}/workflows`;
export const SITE_URL = `https://${SITE_DOMAINS[Resource.App.stage]}`;

export const CACHE_TTL = 24 * 60 * 60;

export const AWS_LAMBDA_TEMP_DIR = "/tmp";
export const LTA_DATAMALL_BASE_URL =
  "https://datamall.lta.gov.sg/content/dam/datamall/datasets/Facts_Figures/Vehicle Registration";
