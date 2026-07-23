import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP16 = FixedPrecision.create({ places: 16, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

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
    expect(FixedPrecision.not(FP20("0.00000001"))).toBe(false);
    expect(FixedPrecision.and(FP8("2"), FP16("2"))).toBe(true);
    expect(FixedPrecision.and(FP4("0"), FP8("1"))).toBe(false);
    expect(FixedPrecision.or(FP20("0"), FP8("-1"))).toBe(true);
    expect(FixedPrecision.xor(FP8("0"), FP16("3"))).toBe(true);
    expect(FixedPrecision.xor(FP4("1"), FP20("3"))).toBe(false);
    expect(FixedPrecision.and(FP4("0.0001"), FP16("1"))).toBe(true);
  });
});
