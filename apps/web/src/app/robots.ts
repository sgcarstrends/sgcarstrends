import { SITE_URL } from "@web/config";
import type { MetadataRoute } from "next";
import { Resource } from "sst";

const robots = (): MetadataRoute.Robots => {
  const protectedPaths = ["/api/", "/_next/"];

  let rules: MetadataRoute.Robots["rules"];
  switch (Resource.App.stage) {
    case "prod":
      rules = [
        { userAgent: "*", allow: "/" },
        { userAgent: "*", disallow: protectedPaths },
        { userAgent: "*", allow: "/api/og/" },
      ];
      break;
    default:
      rules = [
        { userAgent: "*", disallow: "/" },
        { userAgent: "*", allow: "/api/og/" },
        {
          userAgent: "AhrefsSiteAudit",
          allow: "/",
          disallow: protectedPaths,
        },
        {
          userAgent: "AhrefsSiteAudit",
          allow: "/public/x5wwykuhfx3gazs9h8y3fq9fxtnmv9zw.txt",
          disallow: protectedPaths,
        },
      ];
      break;
  }

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
