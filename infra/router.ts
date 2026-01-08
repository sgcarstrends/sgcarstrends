import { isPermanentStage } from "./config";

const DOMAIN_NAME = "sgcarstrends.com";

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

// Create shared router with subdomain aliases
export const router =
  isPermanentStage && $app.stage !== "staging"
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
