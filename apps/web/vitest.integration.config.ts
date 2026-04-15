import { workflow } from "@workflow/vitest";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), workflow()],
  test: {
    include: ["src/**/*.integration.test.ts"],
    exclude: ["**/node_modules/**", "**/.open-next/**", "**/.git/**"],
    testTimeout: 60_000,
  },
});
