import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sgcarstrends/ui"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
