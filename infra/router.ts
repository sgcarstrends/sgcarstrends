const DOMAIN_NAME = "sgcarstrends.com";

const isPermanentStage = ["prod", "staging", "dev"].includes($app.stage);

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
  : sst.aws.Router.get("SGCarsTrends", "E2M8WSGGJD9DL0");

export const url = router.url;

export { DOMAIN_NAME, domain };
