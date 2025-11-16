import { DOMAIN_NAME } from "@sgcarstrends/utils";
import { isPermanentStage } from "./config";

export { DOMAIN_NAME };

const getDomainName = () => {
  switch ($app.stage) {
    case "prod":
      return DOMAIN_NAME;
    case "staging":
      return `staging.${DOMAIN_NAME}`;
    case "dev":
      return `dev.${DOMAIN_NAME}`;
    default:
      return `${$app.stage}.dev.${DOMAIN_NAME}`;
  }
};

const domain = getDomainName();

export const subDomain = (name: string) => {
  if (isPermanentStage) return `${name}.${domain}`;
  return `${name}-${domain}`;
};

// Create shared router with subdomain aliases
export const router = isPermanentStage
  ? new sst.aws.Router("SGCarsTrends", {
      domain: {
        dns: sst.cloudflare.dns(),
        name: domain,
        aliases: [`*.${domain}`],
        ...($app.stage === "prod" && { redirects: [`www.${DOMAIN_NAME}`] }),
      },
    })
  : sst.aws.Router.get("SGCarsTrends", `${process.env.DISTRIBUTION_ID}`);

export const url = router.url;

export { DOMAIN_NAME, domain };
