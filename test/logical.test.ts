import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });

describe("Logical", () => {
  test("instance methods", () => {
    const zero = FP8(0);
    const one = FP8(1);
    const n = FP8("-0.00000001");

    expect(zero.not()).toBe(true);
    expect(one.not()).toBe(false);
    expect(one.and(n)).toBe(true);
    expect(one.and(0)).toBe(false);
    expect(one.and(zero)).toBe(false);
    expect(zero.or(n)).toBe(true);
    expect(zero.or(0)).toBe(false);
    expect(zero.or(one)).toBe(true);
    expect(one.xor(0)).toBe(true);
    expect(one.xor(n)).toBe(false);
  });

  test("static methods", () => {
    expect(FixedPrecision.not(0)).toBe(true);
    expect(FixedPrecision.not("0.00000001")).toBe(false);
    expect(FixedPrecision.and("2", "2")).toBe(true);
    expect(FixedPrecision.and("0", "1")).toBe(false);
    expect(FixedPrecision.or("0", FP8("-1"))).toBe(true);
    expect(FixedPrecision.xor("0", "3")).toBe(true);
    expect(FixedPrecision.xor("1", "3")).toBe(false);
    expect(FixedPrecision.and(FP4("0.0001"), "1")).toBe(true);
  });
});
