import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

describe("Matrix", () => {
  test("dot product", () => {
    expect(FixedPrecision.dot([1, 2, 3], [4, 5, 6]).toNumber()).toBe(32);
  });

  test("cross product", () => {
    const r = FixedPrecision.cross([1, 2, 3], [4, 5, 6]);
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
