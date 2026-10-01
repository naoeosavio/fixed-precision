import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import FixedPrecision from "fixed-precision";
import { describe, expect, test } from "vitest";
import { add } from "../src/arithmetic/add";
import { dataOf } from "../src/construction/dataOf";
import { stringify } from "../src/string/stringify";

const DIST = join(import.meta.dirname, "..", "dist");
const CORE_DIST = join(import.meta.dirname, "..", "..", "core", "dist");

describe("tree-shaking / functional-first", () => {
  test("add standalone returns raw data, not an instance", () => {
    const result = add("1.5", "2.25");
    expect(result instanceof FixedPrecision).toBe(false);
    expect(result.value).toBe(375000000n);
    expect(result.ctx.places).toBe(8);
    expect(stringify(result)).toBe("3.75");
  });

  test("class methods work without importing function modules", () => {
    const result = new FixedPrecision("1.5").add("2.25");
    expect(result.toString()).toBe("3.75");
    expect(new FixedPrecision("2").mul("3").toString()).toBe("6");
  });

  test("dataOf is the bridge from instance to the functional world", () => {
    const FP4 = FixedPrecision.create({ places: 4 });
    const bridged = add(dataOf(FP4("1.5")), "0");
    expect(bridged.ctx.places).toBe(4);
    expect(stringify(bridged)).toBe("1.5");
  });

  // The assertions below need `npm run build`; they are skipped on a bare
  // `npm test` so a fresh clone can run the suite without building first.
  test("subpath entry stays a thin re-export (after build)", () => {
    if (!existsSync(join(DIST, "add.js"))) return;
    const bundle = readFileSync(join(DIST, "add.js"), "utf8");
    expect(bundle.length).toBeLessThan(2000);
    expect(bundle).toContain("./chunk-");
    expect(bundle.includes("3.14159265358979323846")).toBe(false);
  });

  test("core ships no copy of the functional layer (after build)", () => {
    const entry = join(CORE_DIST, "FixedPrecision.js");
    if (!existsSync(entry)) return;
    const bundle = readFileSync(entry, "utf8");
    // Markers that only exist in packages/fp/src.
    expect(bundle).not.toContain("isFixedPrecisionData");
    expect(bundle).not.toContain("compose");
    expect(bundle).not.toContain("fixed-precision-fp");
  });

  test("the value-level core is built in, not imported at runtime (after build)", () => {
    // `fixed-precision` is a devDependency: the operations the functional layer
    // composes are bundled into its chunks, so nothing has to resolve the core
    // package at runtime.
    for (const name of ["add", "sqrt", "stringify"]) {
      const entry = join(DIST, `${name}.js`);
      if (!existsSync(entry)) continue;
      expect(readFileSync(entry, "utf8"), name).not.toContain("fixed-precision");
    }
  });
});
