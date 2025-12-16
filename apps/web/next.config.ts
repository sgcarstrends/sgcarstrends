import type { NextConfig } from "next";

const ONE_DAY = 60 * 60 * 24;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    max: {
      stale: ONE_DAY * 30,
      revalidate: ONE_DAY * 30,
      expire: ONE_DAY * 365,
    },
  },
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
};

export default nextConfig;
