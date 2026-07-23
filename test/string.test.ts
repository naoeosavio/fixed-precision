import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";
import type { RoundingMode } from "../src/FixedPrecision";

const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });

describe("String", () => {
  test("toExponential small", () => {
    expect(FP8("0.01234567").toExponential(4)).toContain("e");
  });

  test("toExponential large", () => {
    expect(FP8("12345678").toExponential(4)).toContain("e");
  });

  test("toExponential small number produces correct mantissa", () => {
    expect(FP8("0.00123").toExponential()).toMatch(/1\.\d+e-3/);
  });

  test("toExponential large number produces correct mantissa", () => {
    expect(FP8("12345").toExponential(4)).toMatch(/1\.2345e/);
  });

  test("toPrecision moderate", () => {
    expect(Number(FP8("12.34567890").toPrecision(4))).toBeCloseTo(12.35, 1);
  });

  test("toPrecision small", () => {
    expect(Number(FP8("0.00123456").toPrecision(3))).toBeGreaterThan(0);
  });

  test("toPrecision large number uses exponential notation", () => {
    const result = FP8("12345").toPrecision(3);
    expect(result).toMatch(/^1\.23e\+4$/);
  });

  test("toPrecision very small number uses exponential notation", () => {
    const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });
    const result = FP20("0.000000123").toPrecision(3);
    expect(result).toMatch(/^1\.23e-7$/);
  });

  test("toPrecision moderate number uses fixed notation", () => {
    expect(FP8("123").toPrecision(3)).toBe("123");
    expect(FP8("0.00123").toPrecision(3)).toBe("0.00123");
  });

  test("toPrecision negative large number uses exponential notation", () => {
    expect(FP8("-12345").toPrecision(3)).toMatch(/^-1\.23e\+4$/);
  });

  test("fromString handles leading dot", () => {
    expect(FP8(".5").toString()).toBe("0.5");
    expect(FP8(".123").toString()).toBe("0.123");
    expect(FP8("-.5").toString()).toBe("-0.5");
  });

  test("prec default half-up", () => {
    const x = FP8("9876.54321");
    expect(x.prec(2).toString()).toBe("9900");
    expect(x.prec(7).toString()).toBe("9876.543");
    expect(x.prec(20).toString()).toBe("9876.54321");
  });

  test("prec down half-up", () => {
    const x = FP8("9876.54321");
    expect(x.prec(1, 1).toString()).toBe("9000");
    expect(x.prec(1, 4).toString()).toBe("10000");
  });

  test("prec no mutate", () => {
    const x = FP8("9876.54321");
    x.prec(2);
    expect(x.toString(false)).toBe("9876.54321000");
  });

  test("prec small negative", () => {
    expect(FP8("0.00123456").prec(2).toString()).toBe("0.0012");
    expect(FP8("-9876.54321").prec(2).toString()).toBe("-9900");
  });

  test("prec validation", () => {
    expect(() => FP8("9876.54321").prec(0)).toThrow(
      "Precision must be a positive integer",
    );
    expect(() => FP8("9876.54321").prec(2, 9 as RoundingMode)).toThrow(
      "Rounding mode 9 is not supported.",
    );
  });

  test("toFixed", () => {
    expect(FP8("123.456789").toFixed(0)).toBe("123");
    expect(FP8("123.456789").toFixed(3)).toBe("123.457");
    const v = FP8(499.99999999999994);
    expect(v.toFixed(4)).toBe("500.0000");
    expect(v.toFixed(4)).toBe(v.scale(4).toString(false));
  });

  test("base conversion", () => {
    expect(FP8("10.625").toBinary()).toBe("1010.101");
    expect(FP8("10.625").toOctal()).toBe("12.5");
    expect(FP8("10.625").toHex()).toBe("a.a");
    expect(FP8("10.625").toHexadecimal()).toBe("a.a");
  });

  test("base conversion sign", () => {
    expect(FP8("-15.5").toBinary()).toBe("-1111.1");
    expect(FP8("-15.5").toOctal()).toBe("-17.4");
    expect(FP8("-15.5").toHex()).toBe("-f.8");
  });

  test("base conversion rounding", () => {
    expect(FP8("255").toHex(1)).toBe("100");
    expect(FP8("255").toHex(2)).toBe("ff");
    expect(FP8("0.1").toBinary(4)).toBe("0.0001101");
  });

  test("base conversion validation", () => {
    expect(() => FP8("10.625").toBinary(0)).toThrow("Invalid precision");
    expect(() => FP8("10.625").toOctal(1.5)).toThrow("Invalid precision");
    expect(() => FP8("10.625").toHex(1e6)).toThrow("Invalid precision");
  });

  test("toString default strips trailing zeros", () => {
    expect(FP8("5.00000000").toString()).toBe("5");
    expect(FP8("1.23450000").toString()).toBe("1.2345");
    expect(FP8("-42.00000000").toString()).toBe("-42");
    expect(FP8("0").toString()).toBe("0");
    expect(FP8("0.10000000").toString()).toBe("0.1");
    expect(FP8("0.00000000").toString()).toBe("0");
    expect(FP8("100.00000000").toString()).toBe("100");
  });

  test("toString(true) strips trailing zeros", () => {
    expect(FP8("5.00000000").toString(true)).toBe("5");
    expect(FP8("1.23450000").toString(true)).toBe("1.2345");
    expect(FP8("-42.00000000").toString(true)).toBe("-42");
    expect(FP8("0.10000000").toString(true)).toBe("0.1");
    expect(FP8("100.00000000").toString(true)).toBe("100");
  });

  test("toString(false) keeps trailing zeros", () => {
    expect(FP8("5.00000000").toString(false)).toBe("5.00000000");
    expect(FP8("1.23450000").toString(false)).toBe("1.23450000");
    expect(FP8("-42.00000000").toString(false)).toBe("-42.00000000");
    expect(FP8("0.10000000").toString(false)).toBe("0.10000000");
    expect(FP8("100.00000000").toString(false)).toBe("100.00000000");
    expect(FP8("0").toString(false)).toBe("0");
    expect(FP8("0.00000000").toString(false)).toBe("0");
  });

  test("toString edge cases", () => {
    expect(FP8("0.00100000").toString()).toBe("0.001");
    expect(FP8("0.00100000").toString(false)).toBe("0.00100000");
    expect(FP8("0.00123000").toString()).toBe("0.00123");
    expect(FP8("0.00123000").toString(false)).toBe("0.00123000");
  });
});
