// tree-shaking.test.ts — pins the byte floor of the published dist for the
// smallest documented import, `import { add } from "fixed-precision-fns"`.
// esbuild ships with tsup and rollup is a devDependency, so the suite needs no
// extra tools.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import type { Plugin } from "rollup";
import { rollup } from "rollup";
import { describe, expect, test } from "vitest";

const PACKAGE_DIR = fileURLToPath(new URL("..", import.meta.url));
const DIST_INDEX = `${PACKAGE_DIR}dist/index.js`;
const WORKSPACE_MODULES = fileURLToPath(
  new URL("../../node_modules", import.meta.url),
);

// The ci pipeline builds after tests. An absent dist is a clean skip, and the
// gate runs on the next ci pass with a fresh dist.
const has_dist = existsSync(DIST_INDEX);

/**
 * Budget for one `add` bundle. The measured floor today is 3.06 kB (esbuild,
 * minified, ~1.24 kB gzip) and 3.08 kB (rollup, unminified). The headroom
 * absorbs reformat noise, while one extra trig or log module adds far more
 * than the headroom.
 */
const MAX_ADD_BUNDLE_BYTES = 3500;

/**
 * Bundles a one-line consumer of fixed-precision-fns with the dist as the
 * resolved package. This is the minified ESM entry size.
 *
 * @param specifier - Bare import specifier, root or a subpath.
 * @returns Size of the minified bundle.
 */
async function bundle_with_esbuild(specifier: string): Promise<number> {
  const result = await build({
    stdin: {
      contents: `import { add } from "${specifier}";\nconsole.log(add("1.5", "2.25"));\n`,
      loader: "js",
      resolveDir: PACKAGE_DIR,
    },
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2020",
    write: false,
    nodePaths: [WORKSPACE_MODULES],
  });
  return result.outputFiles[0].text.length;
}

const ROLLUP_PLUGIN: Plugin = {
  name: "fixed-precision-consumer",
  resolveId(specifier) {
    if (specifier === "\0consumer-root" || specifier === "\0consumer-subpath") {
      return specifier;
    }
    if (specifier === "fixed-precision-fns") return DIST_INDEX;
    if (specifier === "fixed-precision-fns/add") {
      return `${PACKAGE_DIR}dist/add.js`;
    }
    // Relative imports inside the dist resolve through the default logic.
    return null;
  },
  load(id) {
    if (id === "\0consumer-root") {
      const src = `import { add } from "fixed-precision-fns";\nconsole.log(add("1.5", "2.25"));\n`;
      return src;
    }
    if (id === "\0consumer-subpath") {
      const src = `import { add } from "fixed-precision-fns/add";\nconsole.log(add("1.5", "2.25"));\n`;
      return src;
    }
    return null;
  },
};

/**
 * Bundles the same consumer through rollup. This run uses the rollup defaults,
 * so the resolver ignores the sideEffects field — the worst resolver shape
 * found in practice.
 *
 * @param specifier - Bare import specifier, root or a subpath.
 * @returns Size of the unminified bundle.
 */
async function bundle_with_rollup(specifier: string): Promise<number> {
  const entry =
    specifier === "fixed-precision-fns"
      ? "\0consumer-root"
      : "\0consumer-subpath";
  const bundle = await rollup({
    input: entry,
    plugins: [ROLLUP_PLUGIN],
    treeshake: "recommended",
  });
  const result = await bundle.generate({ format: "esm" });
  await bundle.close();
  const entryChunk = result.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry,
  );
  if (!entryChunk || entryChunk.type !== "chunk") {
    // rollup always emits the entry chunk for a single-input build.
    throw new Error(`rollup emitted no entry chunk for ${specifier}`);
  }
  return entryChunk.code.length;
}

describe("Tree shaking", () => {
  test.skipIf(!has_dist)(
    "esbuild keeps { add } under the byte budget through the root import",
    async () => {
      const bytes = await bundle_with_esbuild("fixed-precision-fns");
      expect(bytes).toBeLessThanOrEqual(MAX_ADD_BUNDLE_BYTES);
    },
  );

  test.skipIf(!has_dist)(
    "esbuild keeps { add } under the byte budget through the subpath import",
    async () => {
      const bytes = await bundle_with_esbuild("fixed-precision-fns/add");
      expect(bytes).toBeLessThanOrEqual(MAX_ADD_BUNDLE_BYTES);
    },
  );

  test.skipIf(!has_dist)(
    "rollup keeps { add } under the byte budget through the root import",
    async () => {
      const bytes = await bundle_with_rollup("fixed-precision-fns");
      expect(bytes).toBeLessThanOrEqual(MAX_ADD_BUNDLE_BYTES);
    },
  );

  test.skipIf(!has_dist)(
    "rollup keeps { add } under the byte budget through the subpath import",
    async () => {
      const bytes = await bundle_with_rollup("fixed-precision-fns/add");
      expect(bytes).toBeLessThanOrEqual(MAX_ADD_BUNDLE_BYTES);
    },
  );
});
