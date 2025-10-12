import codspeedPlugin from "@codspeed/vitest-plugin";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), codspeedPlugin()],
  test: {
    globals: true,
    coverage: {
      include: ["src"],
      exclude: [
        "src/app",
        "src/components/ui",
        "src/config",
        "src/functions",
        "src/lib",
        "src/schema",
        "src/types",
        "**/use-mobile.ts", // Part of shadcn/ui Sidebar
      ],
      reporter: ["text", "json", "html", "lcov"],
    },
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "tests"],
    setupFiles: "./setup-tests.ts",
  },
});
