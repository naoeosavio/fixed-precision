import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

/**
 * One project per publishable package. The core resolves to its sources (never
 * to `dist`), so the suite runs without a build step — the `paths` entries in
 * `tsconfig.base.json` do the same for `tsc`. The functional package reaches the
 * value-level modules by relative path, exactly as it does in the build.
 *
 * Order matters: the specific specifier has to come before the bare name.
 */
const workspaceAlias = [
  {
    find: "fixed-precision/minimal",
    replacement: resolve("packages/core/src/Minimal.ts"),
  },
  {
    find: "fixed-precision",
    replacement: resolve("packages/core/src/FixedPrecision.ts"),
  },
];

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias: workspaceAlias },
        test: {
          name: "core",
          root: resolve("packages/core"),
          include: ["test/**/*.test.ts"],
        },
      },
      {
        resolve: { alias: workspaceAlias },
        test: {
          name: "fp",
          root: resolve("packages/fp"),
          include: ["test/**/*.test.ts"],
        },
      },
    ],
  },
});
