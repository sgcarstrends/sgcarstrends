import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";

const isProd = process.env.NODE_ENV === "production";

let redirects: Redirect[] | PromiseLike<Redirect[]> = [];
if (isProd) {
  redirects = [{ source: "/", destination: "/cars", permanent: false }];
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://assets.sgcarstrends.com/logos/**")],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return redirects;
  },
  transpilePackages: ["@sgcarstrends/api"],
  // Temporary disable build types first
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
