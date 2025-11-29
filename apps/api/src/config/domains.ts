import type { Stage } from "@api/types";

// TODO: Temporary fix - API and web use different base domains.
// API is deployed at *.aws.sgcarstrends.com, web at *.sgcarstrends.com
const API_DOMAIN_NAME = "aws.sgcarstrends.com";
const WEB_DOMAIN_NAME = "sgcarstrends.com";

export const API_DOMAINS: Record<Stage, string> = {
  dev: `api.dev.${API_DOMAIN_NAME}`,
  staging: `api.staging.${API_DOMAIN_NAME}`,
  prod: `api.${API_DOMAIN_NAME}`,
};

export const SITE_DOMAINS: Record<Stage, string> = {
  dev: `dev.${WEB_DOMAIN_NAME}`,
  staging: `staging.${WEB_DOMAIN_NAME}`,
  prod: WEB_DOMAIN_NAME,
};
