import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision.js";

const FP6 = FixedPrecision.create({ places: 6, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

describe("Relational", () => {
  test("cmp", () => {
    expect(FP8("5").cmp(5)).toBe(0);
    expect(FP8("4.99999999").cmp("5.00000000")).toBe(-1);
    expect(FP8("5.00000000").cmp("4.99999999")).toBe(1);
  });

  test("eq", () => {
    expect(FP8("123.45678900").eq("123.45678900")).toBe(true);
    expect(FP8("123.45678900").eq("123.45678899")).toBe(false);
    expect(FP20("3").eq("3")).toBe(true);
  });

  test("gt gte lt lte", () => {
    const a = FP8("10.00000000");
    const b = FP8("9.99999999");
    expect(a.gt(b)).toBe(true);
    expect(a.gte(b)).toBe(true);
    expect(b.lt(a)).toBe(true);
    expect(b.lte(a)).toBe(true);
    expect(FP20("3").lt("4")).toBe(true);
    expect(FP20("3").gt("4")).toBe(false);
    expect(FP20("-5").lt("2")).toBe(true);
    expect(FP20("-5").lt("-3")).toBe(true);
  });

  test("equal values", () => {
    const a = FP8("100.00000000");
    const b = FP8("100.00000000");
    expect(a.gt(b)).toBe(false);
    expect(a.lt(b)).toBe(false);
    expect(a.gte(b)).toBe(true);
    expect(a.lte(b)).toBe(true);
  });

  test("isZero", () => {
    expect(FP8(0).isZero()).toBe(true);
    expect(FP8("0.00000001").isZero()).toBe(false);
  });

  test("isPositive", () => {
    expect(FP8("1.00000000").isPositive()).toBe(true);
    expect(FP8("-1.00000000").isPositive()).toBe(false);
  });

  test("isNegative", () => {
    expect(FP8("-0.00000001").isNegative()).toBe(true);
    expect(FP8("0.00000001").isNegative()).toBe(false);
  });

  test("neg", () => {
    expect(FP8("42.00000000").neg().toString()).toBe("-42.00000000");
    expect(FP8("-42.00000000").neg().toString()).toBe("42.00000000");
    expect(FP6("-3.14").abs().toString()).toBe("3.140000");
    expect(FP6("-3.14").neg().toString()).toBe("3.140000");
    expect(FP6("-3.14").neg().neg().toString()).toBe("-3.140000");
  });

  test("sign", () => {
    expect(FixedPrecision.sign(FP8("2"))).toBe(1);
    expect(FixedPrecision.sign("-2")).toBe(-1);
    expect(FixedPrecision.sign("0")).toBe(0);
    expect(Object.is(FixedPrecision.sign(-0), -0)).toBe(true);
    expect(Object.is(FixedPrecision.sign("-0.0"), -0)).toBe(true);
    expect(Number.isNaN(FixedPrecision.sign(NaN))).toBe(true);
  });
});
