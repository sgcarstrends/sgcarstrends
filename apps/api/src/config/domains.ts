import type { Stage } from "@api/types";
import { DOMAIN_NAME } from "@sgcarstrends/utils";

export { DOMAIN_NAME };

export const API_DOMAINS: Record<Stage, string> = {
  dev: `api.dev.${DOMAIN_NAME}`,
  staging: `api.staging.${DOMAIN_NAME}`,
  prod: `api.${DOMAIN_NAME}`,
};

export const SITE_DOMAINS: Record<Stage, string> = {
  dev: `dev.${DOMAIN_NAME}`,
  staging: `staging.${DOMAIN_NAME}`,
  prod: DOMAIN_NAME,
};
