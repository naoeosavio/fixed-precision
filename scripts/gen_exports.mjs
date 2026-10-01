// gen_exports.mjs — keeps the `exports` map of every publishable package in
// sync with the entry points that exist on disk, so the map can never drift
// from what tsup builds.
//
// Usage:
//   node scripts/gen_exports.mjs          # rewrite each package.json
//   node scripts/gen_exports.mjs --check   # exit 1 if any package.json is stale

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function dual(dist_name) {
  return {
    import: {
      types: `./dist/${dist_name}.d.ts`,
      default: `./dist/${dist_name}.js`,
    },
    require: {
      types: `./dist/${dist_name}.d.cts`,
      default: `./dist/${dist_name}.cjs`,
    },
  };
}

/** Collects `<category>/<name>.ts` files as subpath -> dist basename. */
function map_flat_entries(src_dir) {
  const entries = {};
  for (const category of readdirSync(src_dir).sort()) {
    const category_path = join(src_dir, category);
    if (!statSync(category_path).isDirectory()) continue;
    for (const file of readdirSync(category_path).sort()) {
      if (!file.endsWith(".ts")) continue;
      const name = file.slice(0, -3);
      if (name === "index") continue;
      entries[name] = name;
    }
  }
  return entries;
}

/**
 * Package dir -> { main, subpaths, exclude }.
 *
 * `main` and `subpaths` values are dist basenames (what tsup names the entry);
 * subpath keys may differ in case, as `fixed-precision/minimal` does.
 */
const PACKAGES = [
  {
    dir: "packages/core",
    main: "FixedPrecision",
    subpaths: { minimal: "Minimal" },
  },
  {
    dir: "packages/fp",
    main: "index",
    subpaths: null,
    // Internal building blocks of the functional layer. They stay reachable
    // through the main entry (the barrel re-exports them), but they are not
    // subpaths: that keeps the v1.7.3 surface identical under a new name.
    exclude: ["context", "safeIndex", "types", "value"],
  },
];

function build_exports({ main, subpaths, dir, exclude = [] }) {
  const names = subpaths ?? map_flat_entries(join(ROOT, dir, "src"));
  const exports_map = { "./package.json": "./package.json", ".": dual(main) };
  for (const subpath of Object.keys(names).sort()) {
    if (exclude.includes(subpath)) continue;
    exports_map[`./${subpath}`] = dual(names[subpath]);
  }
  return exports_map;
}

function main() {
  const is_check = process.argv.includes("--check");
  let stale = 0;

  for (const pkg of PACKAGES) {
    const pkg_path = join(ROOT, pkg.dir, "package.json");
    if (!existsSync(pkg_path)) continue;
    const manifest = JSON.parse(readFileSync(pkg_path, "utf8"));
    const next = build_exports(pkg);
    const label = `${pkg.dir}/package.json (${Object.keys(next).length} entries)`;
    if (JSON.stringify(manifest.exports) === JSON.stringify(next)) {
      console.log(`ok    ${label}`);
      continue;
    }
    if (is_check) {
      console.error(
        `stale ${pkg.dir}/package.json — run: node scripts/gen_exports.mjs`,
      );
      stale += 1;
      continue;
    }
    manifest.exports = next;
    writeFileSync(pkg_path, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`write ${label}`);
  }

  if (stale > 0) process.exit(1);
}

main();
