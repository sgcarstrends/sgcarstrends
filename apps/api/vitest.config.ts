import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,ts}"],
      exclude: ["**/node_modules/**", "**/*.d.ts"],
    },
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
