import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: ["@sgcarstrends/ui"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
