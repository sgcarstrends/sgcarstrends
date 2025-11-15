import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
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
        "src/components/tables/columns/cars-make-columns.tsx",
        "src/utils/months.ts",
        "src/utils/resend.ts",
        "src/actions/**", // Server actions depend on database
        "src/proxy.ts", // Next.js proxy middleware relies on Next internals
        "**/use-mobile.ts", // Part of shadcn/ui Sidebar
        "**/visitors",
      ],
      reporter: ["text", "text-summary", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
    },
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "tests"],
    setupFiles: "./setup-tests.ts",
  },
});
