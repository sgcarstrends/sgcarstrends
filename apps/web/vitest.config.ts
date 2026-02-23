import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      enabled: true,
      include: ["src"],
      exclude: [
        "src/app",
        "src/components/analytics.tsx",
        "src/components/ui",
        "src/config",
        "src/functions",
        // Exclude src/lib subdirectories except updater
        "src/lib/cars/**",
        "src/lib/coe/**",
        "src/lib/data/**",
        "src/lib/metadata/**",
        "src/lib/og/**",
        "src/lib/realtime/**",
        "src/lib/social/**",
        "src/lib/workflows/**",
        "src/lib/*.ts", // Exclude loose files in src/lib
        "src/schema",
        "src/types",
        "src/components/unreleased-feature.tsx",
        "src/components/tables/**", // Tables not prioritized for coverage
        "src/components/charts/market-share.tsx", // Complex chart component
        "src/components/charts/trends.tsx", // Complex chart component
        "src/components/notifications.tsx", // Realtime component
        "src/components/tables/columns/cars-make-columns.tsx",
        "src/utils/months.ts",
        "src/proxy.ts", // Next.js proxy middleware relies on Next internals
        "**/use-mobile.ts", // Part of shadcn/ui Sidebar
        "**/visitors",
        "src/queries/coe/**", // Low priority for coverage
        "src/queries/posts/**", // Blog queries not prioritized for coverage

        // Barrel files (pure re-exports, no logic)
        "src/components/charts/index.ts",
        "src/components/coe/index.ts",
        "src/components/shared/index.ts",
        "src/queries/index.ts",
        "src/queries/cars/index.ts",
        "src/queries/cars/makes/index.ts",
        "src/queries/deregistrations/index.ts",
        "src/lib/updater/index.ts",
        "src/lib/updater/services/index.ts",
        "src/utils/arrays/index.ts",
        "src/utils/dates/index.ts",
        "src/utils/formatting/index.ts",
        "src/utils/social/index.ts",

        // Infrastructure/setup files (external service integration)
        "src/instrumentation.ts",
        "src/actions/maintenance.ts",

        // Presentational components (UI-only, no business logic)
        "src/components/loading-indicator.tsx",
        "src/components/registration-trend.tsx",
        "src/components/top-makes-chart.tsx",
        "src/components/charts/base/**",
        "src/components/shared/skeleton.tsx",

        // EV queries (DB aggregation, no testable logic without DB)
        "src/queries/cars/electric-vehicles.ts",

        // Simple DB/API wrappers (no business logic)
        "src/queries/cars/latest-month.ts",
        "src/utils/social/linkedin.ts",
      ],
      reporter: ["text", "text-summary", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    exclude: [...configDefaults.exclude, "tests"],
    setupFiles: "./setup-tests.ts",
  },
});
