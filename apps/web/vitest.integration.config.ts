import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { workflow } from "@workflow/vitest";

export default defineConfig({
  plugins: [tsconfigPaths(), workflow()],
  test: {
    include: ["src/**/*.integration.test.ts"],
    exclude: ["**/node_modules/**", "**/.open-next/**", "**/.git/**"],
    testTimeout: 60_000,
  },
});
