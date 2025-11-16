import { APP_ENV, SITE_URL } from "@web/config";
import { AppEnv } from "@web/types";
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  // Protect API routes and Next.js data endpoints, but allow static assets
  const protectedPaths = ["/api/", "/_next/data/"];

  // Support both Vercel (VERCEL_ENV) and SST (NEXT_PUBLIC_APP_ENV) deployments
  const isProduction =
    process.env.VERCEL_ENV === "production" || APP_ENV === AppEnv.PROD;

  let rules: MetadataRoute.Robots["rules"];

  if (isProduction) {
    rules = [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", allow: "/_next/static/" },
      { userAgent: "*", disallow: protectedPaths },
      { userAgent: "*", allow: "/api/og/" },
    ];
  } else {
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
        allow: "/_next/static/",
        disallow: protectedPaths,
      },
      {
        userAgent: "AhrefsSiteAudit",
        allow: "/public/x5wwykuhfx3gazs9h8y3fq9fxtnmv9zw.txt",
        disallow: protectedPaths,
      },
    ];
  }

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
