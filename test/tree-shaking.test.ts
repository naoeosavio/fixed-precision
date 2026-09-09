import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import FixedPrecision from "../src/FixedPrecision";
import { add } from "../src/FP/arithmetic/add";
import { dataOf } from "../src/FP/construction/dataOf";
import { stringify } from "../src/FP/string/stringify";

describe("tree-shaking / functional-first", () => {
  test("add standalone returns raw data, not an instance", () => {
    const result = add("1.5", "2.25");
    expect(result instanceof FixedPrecision).toBe(false);
    expect(result.value).toBe(375000000n);
    expect(result.places).toBe(8);
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
    expect(bridged.places).toBe(4);
    expect(stringify(bridged)).toBe("1.5");
  });

  test("subpath bundle does not embed the full library (after build)", () => {
    if (!existsSync("dist/add.js")) return;
    const bundle = readFileSync("dist/add.js", "utf8");
    expect(bundle.length).toBeLessThan(20000);
    expect(bundle.includes("3.14159265358979323846")).toBe(false);
    const compareBundle = readFileSync("dist/compare.js", "utf8");
    expect(compareBundle.length).toBeLessThan(10000);
    expect(compareBundle.includes("3.14159265358979323846")).toBe(false);
  });
});
