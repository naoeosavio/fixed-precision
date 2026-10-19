import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

const FP6 = FixedPrecision.create({ places: 6, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

describe("Relational", () => {
  test("cmp", () => {
    expect(FP8("5").cmp(5)).toBe(0);
    expect(FP8("4.99999999").cmp("5")).toBe(-1);
    expect(FP8("5").cmp("4.99999999")).toBe(1);
  });

  test("eq", () => {
    expect(FP8("123.456789").eq("123.456789")).toBe(true);
    expect(FP8("123.456789").eq("123.45678899")).toBe(false);
    expect(FP20("3").eq("3")).toBe(true);
  });

  test("gt gte lt lte", () => {
    const a = FP8("10");
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
    const a = FP8("100");
    const b = FP8("100");
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
    expect(FP8("1").isPositive()).toBe(true);
    expect(FP8("-1").isPositive()).toBe(false);
  });

  test("isNegative", () => {
    expect(FP8("-0.00000001").isNegative()).toBe(true);
    expect(FP8("0.00000001").isNegative()).toBe(false);
  });

  test("neg", () => {
    expect(FP8("42").neg().toString()).toBe("-42");
    expect(FP8("-42").neg().toString()).toBe("42");
    expect(FP6("-3.14").abs().toString()).toBe("3.14");
    expect(FP6("-3.14").neg().toString()).toBe("3.14");
    expect(FP6("-3.14").neg().neg().toString()).toBe("-3.14");
  });

  test("sign", () => {
    expect(FixedPrecision.sign(FP8("2"))).toBe(1);
    expect(FixedPrecision.sign("-2")).toBe(-1);
    expect(FixedPrecision.sign("0")).toBe(0);
    expect(Object.is(FixedPrecision.sign(-0), -0)).toBe(true);
    expect(Object.is(FixedPrecision.sign("-0.0"), -0)).toBe(true);
    expect(() => FixedPrecision.sign(NaN)).toThrow(
      "sign requires a numeric value, got NaN",
    );
    expect(() => FixedPrecision.sign("abc")).toThrow(
      'sign requires a numeric value, got "abc"',
    );
  });
});

describe("coerce policy: roundingMode is not compared (4.3)", () => {
  const FP8rm0 = FixedPrecision.create({ places: 8, roundingMode: 0 });
  const FP8rm4 = FixedPrecision.create({ places: 8, roundingMode: 4 });
  const FP8rm8 = FixedPrecision.create({ places: 8, roundingMode: 8 });

  test("relationals compare normally when only roundingMode differs", () => {
    expect(FP8rm0("1.5").eq(FP8rm8("1.5"))).toBe(true);
    expect(FP8rm0("1.5").eq(FP8rm4("1.6"))).toBe(false);
    expect(FP8rm0("2").cmp(FP8rm8("1"))).toBe(1);
    expect(FP8rm0("2").gt(FP8rm8("1"))).toBe(true);
    expect(FP8rm0("2").gte(FP8rm8("2"))).toBe(true);
    expect(FP8rm0("2").lt(FP8rm8("3"))).toBe(true);
    expect(FP8rm0("2").lte(FP8rm8("2"))).toBe(true);
  });

  test("arithmetic works when only roundingMode differs", () => {
    expect(FP8rm0("2").add(FP8rm8("3")).toString()).toBe("5");
    expect(FP8rm0("5").sub(FP8rm8("3")).toString()).toBe("2");
    expect(FP8rm0("2").mul(FP8rm8("3")).toString()).toBe("6");
    expect(FP8rm0("6").div(FP8rm8("3")).toString()).toBe("2");
    expect(FP8rm0("2").plus(FP8rm8("3")).toString()).toBe("5");
    expect(FP8rm0("2").times(FP8rm8("3")).toString()).toBe("600000000");
    expect(FP8rm0("6").ratio(FP8rm8("3")).toString()).toBe("0.00000002");
    expect(FP8rm0("7").mod(FP8rm8("3")).toString()).toBe("1");
    expect(FP8rm0("7").rem(FP8rm8("3")).toString()).toBe("1");
  });

  test("different places still throw", () => {
    const FP4rm0 = FixedPrecision.create({ places: 4, roundingMode: 0 });
    expect(() => FP8rm0("1").eq(FP4rm0("1"))).toThrow(
      "Cannot operate on different precisions",
    );
    expect(() => FP8rm0("1").add(FP4rm0("1"))).toThrow();
  });
});
