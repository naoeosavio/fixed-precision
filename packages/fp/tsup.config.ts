import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

/**
 * Every `<category>/<name>.ts` file becomes one subpath entry
 * (`fixed-precision-fp/<name>`), which is what makes the API tree-shakeable at
 * function granularity. The names are kept in sync with `exports` by
 * `scripts/gen_exports.mjs`, which reads this same directory layout.
 */
function collect_flat_entries(srcDir: string): Record<string, string> {
  const entries: Record<string, string> = {};
  const skipped = new Set(["index"]);
  for (const category of readdirSync(srcDir)) {
    const categoryPath = join(srcDir, category);
    if (!statSync(categoryPath).isDirectory()) continue;
    for (const file of readdirSync(categoryPath)) {
      if (!file.endsWith(".ts")) continue;
      const name = file.slice(0, -3);
      if (skipped.has(name)) continue;
      entries[name] = `${srcDir}/${category}/${file}`;
    }
  }
  return entries;
}

export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  target: "es2020",
  outDir: "dist",
  minify: true,
  splitting: true,
  entry: {
    index: "./src/index.ts",
    ...collect_flat_entries("src"),
  },
});
