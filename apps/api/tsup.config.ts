import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  minify: false,
  bundle: true,
  splitting: false,
  treeshake: true,
  dts: false,
  noExternal: [
    // Bundle workspace packages to resolve path aliases and TypeScript
    "@sgcarstrends/database",
    "@sgcarstrends/types",
    "@sgcarstrends/utils",
    "@sgcarstrends/logos",
  ],
  banner: {
    js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`,
  },
});
