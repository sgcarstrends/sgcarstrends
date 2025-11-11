import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";

const isProd =
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_APP_ENV === "prod";

let redirects: Redirect[] | PromiseLike<Redirect[]> = [];
if (isProd) {
  redirects = [{ source: "/", destination: "/cars", permanent: false }];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  // cacheComponents: true,
  // cacheLife: {
  //   blogs: {
  //     stale: 3600 * 24 * 7, // 1 week - blog posts rarely change
  //     revalidate: 3600 * 24, // 1 day
  //     expire: 3600 * 24 * 30, // 30 days
  //   },
  //   monthlyData: {
  //     stale: 3600 * 24, // 1 day - historical data is immutable
  //     revalidate: 3600 * 6, // 6 hours
  //     expire: 3600 * 24 * 90, // 90 days
  //   },
  //   latestData: {
  //     stale: 300, // 5 minutes - actively updating
  //     revalidate: 900, // 15 minutes
  //     expire: 3600, // 1 hour
  //   },
  //   statistics: {
  //     stale: 3600, // 1 hour - aggregated data
  //     revalidate: 3600 * 6, // 6 hours
  //     expire: 3600 * 24 * 7, // 7 days
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.sgcarstrends.com",
        pathname: "/logos/**",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
        pathname: "/logos/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: ["@sgcarstrends/ui"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
