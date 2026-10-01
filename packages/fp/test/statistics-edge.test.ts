import FixedPrecision from "fixed-precision";
import { describe, expect, test } from "vitest";
import * as FP from "../src";
import { dataOf } from "../src/construction";
import { stringify } from "../src/string";

// ─── 3.5 min/max/sum edge cases ────────────────────────────────────

describe("min/max/sum edge cases (3.5)", () => {
  const P8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
  const P2 = FixedPrecision.create({ places: 2, roundingMode: 4 });

  test("ties keep first occurrence", () => {
    const da = dataOf(P8("5"));
    const db = dataOf(P8("5"));
    expect(FP.min(da, db)).toBe(da);
    expect(FP.max(da, db)).toBe(da);
  });

  test("mixed contexts resolve to highest places", () => {
    expect(stringify(FP.min(dataOf(P2("5")), dataOf(P8("3"))))).toBe("3");
    expect(stringify(FP.max(dataOf(P2("5")), dataOf(P8("3"))))).toBe("5");
    expect(stringify(FP.sum(dataOf(P2("1.5")), dataOf(P8("2.25"))))).toBe(
      "3.75",
    );
  });

  test("sum with empty input", () => {
    expect(stringify(FP.sum([]))).toBe("0");
  });

  test("negative values", () => {
    expect(stringify(FP.min(dataOf(P8("-5")), dataOf(P8("-1"))))).toBe("-5");
    expect(stringify(FP.max(dataOf(P8("-5")), dataOf(P8("-1"))))).toBe("-1");
  });
});
