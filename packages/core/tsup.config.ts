import { defineConfig } from "tsup";

/**
 * `fixed-precision` ships the class and its slim variant, each bundled on its
 * own. The value-level operations under `src/core` are reached by
 * `fixed-precision-fp`, which builds them into its own entries.
 */
export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  target: "es2020",
  outDir: "dist",
  minify: true,
  splitting: false,
  entry: {
    FixedPrecision: "./src/FixedPrecision.ts",
    Minimal: "./src/Minimal.ts",
  },
});
