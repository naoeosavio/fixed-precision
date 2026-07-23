import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP16 = FixedPrecision.create({ places: 16, roundingMode: 4 });

describe("Matrix", () => {
  test("dot product", () => {
    expect(FixedPrecision.dot([FP8("1"), FP8("2"), FP8("3")], [FP16("4"), FP16("5"), FP16("6")]).toNumber()).toBe(32);
  });

  test("cross product", () => {
    const r = FixedPrecision.cross([FP8("1"), FP8("2"), FP8("3")], [FP16("4"), FP16("5"), FP16("6")]);
    expect(r.length).toBe(3);
    expect(r[0]?.toNumber()).toBe(-3);
    expect(r[1]?.toNumber()).toBe(6);
    expect(r[2]?.toNumber()).toBe(-3);
  });

  test("dot length mismatch throws", () => {
    expect(() => FixedPrecision.dot([1, 2], [4, 5, 6])).toThrow();
  });

  test("cross length mismatch throws", () => {
    expect(() => FixedPrecision.cross([1, 2], [4, 5, 6])).toThrow();
  });
});
