import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision.js";

const FP = FixedPrecision.create({ places: 0 });
const FP2 = FixedPrecision.create({ places: 2, roundingMode: 4 });
const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP6 = FixedPrecision.create({ places: 6, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP10 = FixedPrecision.create({ places: 10, roundingMode: 4 });
const FP15 = FixedPrecision.create({ places: 15, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

describe("Numeric", () => {
  test("constructor string", () => {
    expect(FP8(12345.67891234).toString()).toBe("12345.67891234");
    expect(FP8(0.123456789).toString()).toBe("0.12345678");
  });

  test("constructor number", () => {
    expect(FP8(42.12345678).toString()).toBe("42.12345678");
  });

  test("constructor bigint", () => {
    expect(FP8("123456789").toNumber()).toBe(123456789);
  });

  test("constructor invalid throws", () => {
    expect(() => FP8("abc")).toThrow();
  });

  test("toNumber zero", () => {
    for (const input of [
      "0",
      "0.0",
      "0.000000000000",
      "-0",
      "-0.0",
      "-0.000000000000",
    ]) {
      const r = FP8(input).toNumber();
      expect(r).toBe(0);
      expect(Object.is(r, -0)).toBe(false);
    }
  });

  test("toNumber non-finite throws", () => {
    for (const input of [
      Infinity,
      "Infinity",
      -Infinity,
      "-Infinity",
      NaN,
      "NaN",
    ]) {
      expect(() => FP8(input).toNumber()).toThrow();
    }
  });

  test("toNumber one forms", () => {
    expect(FP8(1).toNumber()).toBe(1);
    expect(FP8("1").toNumber()).toBe(1);
    expect(FP8("1.0").toNumber()).toBe(1);
    expect(FP8(-1).toNumber()).toBe(-1);
    expect(FP8("-1").toNumber()).toBe(-1);
    expect(FP8("-1.0").toNumber()).toBe(-1);
    expect(FP8("9007199254740991").toNumber()).toBe(9007199254740991);
    expect(FP8("-9007199254740991").toNumber()).toBe(-9007199254740991);
  });

  test("toNumber high precision", () => {
    expect(FP15("123.456789876543").toNumber()).toBe(123.456789876543);
    expect(FP15("-123.456789876543").toNumber()).toBe(-123.456789876543);
  });

  test("toNumber above MAX_SAFE_INTEGER", () => {
    const r = FP20("499.99999999999994").round(4);
    expect(r.toString()).toBe("500.00000000000000000000");
    expect(r.toNumber()).toBe(500);
    expect(r.toNumber()).toBe(Number(r.toFixed(4)));
  });

  test("toNumber lower-scale above max safe", () => {
    const p = FP8("123456789.12345678");
    const n = FP8("-123456789.12345678");
    expect(p.raw() > BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(n.raw() < -BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(p.toNumber()).toBe(Number(p.toString()));
    expect(n.toNumber()).toBe(Number(n.toString()));
  });

  test("toNumber with places", () => {
    const v = FP8("1.255");
    expect(v.toNumber(2)).toBe(1.26);
    expect(v.toString()).toBe("1.25500000");
  });

  test("isInteger", () => {
    expect(FP8("10.00000000").isInteger()).toBe(true);
    expect(FP8("10.00000001").isInteger()).toBe(false);
  });

  test("places", () => {
    expect(FP4("1.23").places()).toBe(4);
    expect(FP4("1.23").decimalPlaces()).toBe(4);
  });

  test("precision", () => {
    expect(FP8("123.450000").precision()).toBe(5);
    expect(FP8("0.00123000").precision()).toBe(3);
    expect(FP8("1000").precision()).toBe(1);
    expect(FP8("0").precision()).toBe(1);
  });

  test("precision with trailing zeros", () => {
    expect(FP8("1000").precision(true)).toBe(4);
    expect(FP8("1000").sd(true)).toBe(4);
  });

  test("isFixedPrecision", () => {
    expect(FixedPrecision.isFixedPrecision(FP8("1"))).toBe(true);
    expect(FixedPrecision.isFixedPrecision("1")).toBe(false);
  });

  test("string representations", () => {
    expect(FP("123456789").toString()).toBe("123456789");
    expect(FP2("-1234.56").toString()).toBe("-1234.56");
    expect(FP4("9.5").toString()).toBe("9.5000");
    expect(FP4("0.0099").toString()).toBe("0.0099");
    expect(FP4("0").toString()).toBe("0");
    expect(
      FP2("3.141592653589793238462643383279502884197169").toString(),
    ).toBe("3.14");
  });

  test("parse", () => {
    expect(FP6(42).toString()).toBe("42.000000");
    expect(FP6(-999).toString()).toBe("-999.000000");
    expect(FP6(Number.MAX_SAFE_INTEGER).toString()).toBe(
      "9007199254740991.000000",
    );
    expect(FP6("1234.56789").trunc().toNumber()).toBe(1234);
    expect(FP6("-99").trunc().toNumber()).toBe(-99);
    expect(FP10(3.14159265358979).toString()).toBe("3.1415926535");
    expect(FP10(-0.1).toString()).toBe("-0.1000000000");
    expect(FP10(1 / 3).toString()).toBe("0.3333333333");
    expect(FP6(1e15).toString()).toBe("1000000000000000.000000");
    expect(() => FP6(NaN)).toThrow();
    expect(() => FP6(Infinity)).toThrow();
    expect(FP10("3.1415926535").toNumber()).toBeCloseTo(3.1415926535);
    expect(FP10("-1234567890.1234567890").toNumber()).toBeCloseTo(
      -1234567890.123456789,
    );
  });
});
