import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";

const _ONE_DAY = 60 * 60 * 24;

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
  cacheComponents: false,
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
    mcpServer: true,
    turbopackFileSystemCacheForDev: true,
    typedEnv: true,
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
