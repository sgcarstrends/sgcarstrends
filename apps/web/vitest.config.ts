import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      include: ["src"],
      exclude: [
        "src/app",
        "src/components/analytics.tsx",
        "src/components/ui",
        "src/config",
        "src/functions",
        "src/lib",
        "src/schema",
        "src/types",
        "src/components/dashboard/skeletons/**",
        "src/components/unreleased-feature.tsx",
        "src/components/tables/**", // Tables not prioritized for coverage
        "src/components/charts/market-share.tsx", // Complex chart component
        "src/components/charts/trends.tsx", // Complex chart component
        "src/components/notifications.tsx", // Realtime component
        "src/components/tables/columns/cars-make-columns.tsx",
        "src/utils/months.ts",
        "src/utils/resend.ts",
        "src/actions/**", // Server actions depend on database
        "src/proxy.ts", // Next.js proxy middleware relies on Next internals
        "**/use-mobile.ts", // Part of shadcn/ui Sidebar
        "**/visitors",
        "src/queries/coe/**", // Low priority for coverage
        "src/queries/posts/**", // Blog queries not prioritized for coverage
      ],
      reporter: ["text", "text-summary", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        autoUpdate: (newThreshold) => {
          const roundedUp = Math.ceil(newThreshold / 5) * 5;
          return Math.min(roundedUp, 80);
        },
        lines: 80,
        functions: 75,
        branches: 70,
        statements: 80,
      },
    },
    exclude: [...configDefaults.exclude, "tests"],
    setupFiles: "./setup-tests.ts",
  },
});
