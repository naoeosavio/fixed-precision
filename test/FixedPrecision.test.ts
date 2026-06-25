import { describe, expect, test } from "vitest";

import FixedPrecision, {
  type FixedPrecisionConfig,
  fixedconfig,
  type RoundingMode,
} from "../src/FixedPrecision.js";

const FP = FixedPrecision.create({ places: 0 });
const FP2 = FixedPrecision.create({ places: 2, roundingMode: 4 });
const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP6 = FixedPrecision.create({ places: 6, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP8_DOWN = FixedPrecision.create({ places: 8, roundingMode: 1 });
const FP10 = FixedPrecision.create({ places: 10, roundingMode: 4 });
const FP15 = FixedPrecision.create({ places: 15, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

const PI = "3.14159265358979323846";
const HALF_PI = "1.57079632679489661923";

describe("FixedPrecision", () => {
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

  describe("Relational", () => {
    test("cmp", () => {
      expect(FP8("5").cmp(FP8(5))).toBe(0);
      expect(FP8("4.99999999").cmp(FP8("5.00000000"))).toBe(-1);
      expect(FP8("5.00000000").cmp(FP8("4.99999999"))).toBe(1);
    });

    test("eq", () => {
      expect(FP8("123.45678900").eq(FP8("123.45678900"))).toBe(true);
      expect(FP8("123.45678900").eq(FP8("123.45678899"))).toBe(false);
    });

    test("gt gte lt lte", () => {
      const a = FP8("10.00000000");
      const b = FP8("9.99999999");
      expect(a.gt(b)).toBe(true);
      expect(a.gte(b)).toBe(true);
      expect(b.lt(a)).toBe(true);
      expect(b.lte(a)).toBe(true);
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

  describe("Bitwise", () => {
    test("bitAnd", () => {
      expect(FP(12).bitAnd(FP(5)).toString()).toBe("4");
    });

    test("bitOr", () => {
      expect(FP(12).bitOr(FP(5)).toString()).toBe("13");
    });

    test("bitXor", () => {
      expect(FP(12).bitXor(FP(5)).toString()).toBe("9");
    });

    test("bitNot", () => {
      expect(FP(12).bitNot().toString()).toBe("-13");
    });

    test("leftShift", () => {
      expect(FP(12).leftShift(2).toString()).toBe("48");
      expect(() => FP(12).leftShift(-1)).toThrow();
    });

    test("rightArithShift", () => {
      expect(FP(12).rightArithShift(2).toString()).toBe("3");
      expect(() => FP(12).rightArithShift(-1)).toThrow();
    });
  });

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

  describe("Statistics", () => {
    test("min", () => {
      expect(FixedPrecision.min("5.5").toString()).toBe("5.50000000");
      expect(FixedPrecision.min("10.5", "3.2").toNumber()).toBe(3.2);
      expect(
        FixedPrecision.min("5.0", "3.0", "7.0", "1.0", "4.0").toNumber(),
      ).toBe(1);
      expect(FixedPrecision.min("-5.0", "-10.0", "3.0").toNumber()).toBe(-10);
    });

    test("min instances", () => {
      expect(FixedPrecision.min(FP8("100.5"), FP8("50.25")).toNumber()).toBe(
        50.25,
      );
      expect(FixedPrecision.min(FP8("10.0"), "5.5", 3.0).toNumber()).toBe(3);
      expect(FixedPrecision.min(FP4("100.5"), "50.25").toString()).toBe(
        "50.25000000",
      );
    });

    test("max", () => {
      expect(FixedPrecision.max("-3.5").toString()).toBe("-3.50000000");
      expect(FixedPrecision.max("10.5", "3.2").toNumber()).toBe(10.5);
      expect(
        FixedPrecision.max("1.0", "3.0", "7.0", "5.0", "2.0").toNumber(),
      ).toBe(7);
      expect(FixedPrecision.max("-5.0", "-10.0", "-3.0").toNumber()).toBe(-3);
    });

    test("max instances", () => {
      expect(FixedPrecision.max(FP8("50.25"), FP8("100.5")).toNumber()).toBe(
        100.5,
      );
      expect(FixedPrecision.max(FP8("10.0"), "5.5", 3.0).toNumber()).toBe(10);
    });

    test("min/max equal values", () => {
      expect(FixedPrecision.min("5.0", "5.0", "5.0").toNumber()).toBe(5);
      expect(FixedPrecision.max("5.0", "5.0", "5.0").toNumber()).toBe(5);
    });

    test("min/max array", () => {
      expect(FixedPrecision.min([2, 1, 4, 3]).toNumber()).toBe(1);
      expect(FixedPrecision.max([2, 1, 4, 3]).toNumber()).toBe(4);
    });

    test("min/max empty throws", () => {
      expect(() => FixedPrecision.min([])).toThrow(
        "FixedPrecision.min requires at least one argument",
      );
      expect(() => FixedPrecision.max([])).toThrow(
        "FixedPrecision.max requires at least one argument",
      );
    });

    test("sum", () => {
      expect(FixedPrecision.sum("2.5", "3.5", "1.0").toNumber()).toBe(7);
      expect(FixedPrecision.sum("5.5").toNumber()).toBe(5.5);
      expect(FixedPrecision.sum([1, 2, 3, 4]).toNumber()).toBe(10);
      expect(FixedPrecision.sum("10.0", "-3.0", "-2.0").toNumber()).toBe(5);
    });

    test("sum instances", () => {
      expect(FixedPrecision.sum(FP8("10.5"), "5.25", 3.0).toNumber()).toBe(
        18.75,
      );
      expect(FixedPrecision.sum(FP4("10.50"), "20.25").toString()).toBe(
        "30.75000000",
      );
      expect(FixedPrecision.sum([]).toNumber()).toBe(0);
    });

    test("hypot", () => {
      expect(FixedPrecision.hypot(3, 4).toString()).toBe("5.00000000");
      expect(FixedPrecision.hypot("1", "2", "2").toString()).toBe(
        "3.00000000",
      );
      expect(FixedPrecision.hypot([6, 8]).toString()).toBe("10.00000000");
      expect(FixedPrecision.hypot().toString()).toBe("0");
      expect(FixedPrecision.hypot(FP4("3"), "4").toString()).toBe(
        "5.00000000",
      );
    });
  });

  describe("Arithmetic", () => {
    test("add", () => {
      expect(FP8("10.5").add(FP8("3.2")).toString()).toBe("13.70000000");
      expect(FP8("10.5").add(FP8(0)).toString()).toBe("10.50000000");
    });

    test("sub", () => {
      expect(FP8("3.2").sub(FP8("10.5")).toString()).toBe("-7.30000000");
      expect(FP8("10.5").sub(FP8(0)).toString()).toBe("10.50000000");
    });

    test("mul", () => {
      expect(FP8("10.5").mul(FP8("3.2")).toString()).toBe("33.60000000");
      expect(FP8("10.5").mul(FP8(1)).toString()).toBe("10.50000000");
    });

    test("div", () => {
      expect(FP8("10.5").div(FP8("3.2")).toFixed(2)).toBe("3.28");
      expect(FP8("10.5").div(FP8("10.5")).toString()).toBe("1.00000000");
      expect(() => FP8("10.5").div(FP8(0))).toThrow("Division by zero");
    });

    test("mod", () => {
      expect(FP8("10").mod(FP8("3")).toString()).toBe("1.00000000");
      expect(FP8("10").mod(FP8("5")).toString()).toBe("0");
    });

    test("product", () => {
      expect(FP8("100000000").product(FP8("100000000")).toString()).toBe(
        "1000000000000000000000000.00000000",
      );
      expect(FP8("10.5").product(FP8(1)).toString()).toBe(
        "1050000000.00000000",
      );
    });

    test("idiv", () => {
      expect(FP8("7.5").idiv(2).toString()).toBe("3.00000000");
      expect(FP8("-7.5").idiv(2).toString()).toBe("-3.00000000");
      expect(FP8("7.5").dividedToIntegerBy(2).toString()).toBe(
        FP8("7.5").idiv(2).toString(),
      );
    });

    test("fraction", () => {
      expect(
        FP8("10.00000000").fraction(FP8("0.00000002")).toString(),
      ).toBe("5.00000000");
    });

    test("leftover", () => {
      expect(
        FP8("10.50000000").leftover(FP8("3.00000000")).toString(),
      ).toBe("1.50000000");
    });

    test("clamp", () => {
      expect(FP8("5").clamp(0, 10).toString()).toBe("5.00000000");
      expect(FP8("-1").clamp(0, 10).toString()).toBe("0");
      expect(FP8("11").clamp(0, 10).toString()).toBe("10.00000000");
    });

    test("clampedTo", () => {
      expect(FP8("5").clampedTo(0, 10).toString()).toBe(
        FP8("5").clamp(0, 10).toString(),
      );
      expect(() => FP8("5").clamp(10, 0)).toThrow(
        "min must be less than or equal to max",
      );
    });

    test("toNearest", () => {
      expect(FP8("5.5").toNearest(2).toString()).toBe("6.00000000");
      expect(FP8("5").toNearest(2, 1).toString()).toBe("4.00000000");
      expect(FP8("-5").toNearest(2).toString()).toBe("-6.00000000");
      expect(() => FP8("5").toNearest(0)).toThrow(
        "Increment must be non-zero",
      );
    });

    test("ceil", () => {
      expect(FP8("1.00000001").ceil().toString()).toBe("2.00000000");
      expect(FP8("-1.00000001").ceil().toString()).toBe("-1.00000000");
    });

    test("floor", () => {
      expect(FP8("1.99999999").floor().toString()).toBe("1.00000000");
      expect(FP8("-1.00000001").floor().toString()).toBe("-2.00000000");
    });

    test("trunc", () => {
      expect(FP8("1.98765432").trunc().toString()).toBe("1.00000000");
      expect(FP8("-1.98765432").trunc().toString()).toBe("-1.00000000");
    });

    test("round", () => {
      expect(FP8("1.23456789").round(4).toString()).toBe("1.23460000");
      expect(FP8("1.23456789").round(4, 1).toString()).toBe("1.23450000");
      expect(FP8("1.23455000").round(4, 4).toString()).toBe("1.23460000");
      expect(FP8("-1.23455000").round(4, 4).toString()).toBe("-1.23460000");
      expect(FP8("1.23456789").round(2).toString()).toBe("1.23000000");
    });

    test("pow", () => {
      expect(FP8("2.00000000").pow(3).toString()).toBe("8.00000000");
      expect(FP8("2.00000000").pow(-2).toFixed(8)).toBe("0.25000000");
    });

    test("square cube", () => {
      expect(FP8("3.50000000").square().toString()).toBe("12.25000000");
      expect(FP8("2.50000000").cube().toString()).toBe("15.62500000");
      expect(FixedPrecision.square("3.5").toString()).toBe("12.25000000");
      expect(FixedPrecision.cube("2.5").toString()).toBe("15.62500000");
    });

    test("sqrt", () => {
      expect(FP20("9.00000000").sqrt().toFixed(8)).toBe("3.00000000");
      expect(FP20(Math.PI).sqrt().toNumber()).toBeCloseTo(
        Math.sqrt(Math.PI),
        12,
      );
      expect(FP20(0).sqrt().toString()).toBe("0");
      expect(FixedPrecision.sqrt("9").toString()).toBe("3.00000000");
      expect(FixedPrecision.sqrt("2").toNumber()).toBeCloseTo(Math.sqrt(2), 7);
    });

    test("cbrt", () => {
      expect(FP20("27.00000000").cbrt().toFixed(8)).toBe("3.00000000");
      expect(FP20(Math.E).cbrt().toNumber()).toBeCloseTo(
        Math.cbrt(Math.E),
        12,
      );
      expect(FP20("-8.00000000").cbrt().toString()).toBe(
        "-2.00000000000000000000",
      );
      expect(FP20("125.00000000").cubeRoot().toString()).toBe(
        FP20("125.00000000").cbrt().toString(),
      );
      expect(FixedPrecision.cbrt("64").toString()).toBe("4.00000000");
      expect(FixedPrecision.cubeRoot("64").toString()).toBe("4.00000000");
    });

    test("exp", () => {
      expect(FP20("1").exp().toNumber()).toBeCloseTo(Math.E, 14);
      expect(FP20("1").exp().toString()).toBe("2.71828182845904523536");
      expect(FP20("-1").exp().toNumber()).toBeCloseTo(Math.exp(-1), 14);
      expect(FP20("-1").exp().toString()).toBe("0.36787944117144232159");
    });

    test("ln", () => {
      const r = FP20("2.71828182845904523536").ln();
      expect(r.toNumber()).toBeCloseTo(1, 14);
      expect(r.toString()).toBe("0.99999999999999999999");
      expect(FP20("10").ln().toString()).toBe("2.30258509299404568401");
      expect(FP20("123.456789").ln().toString()).toBe(
        "4.81589120820374401402",
      );
    });

    test("log", () => {
      expect(FP20("2").log().toNumber()).toBeCloseTo(Math.log(2), 14);
      expect(FP20("2").log().toString()).toBe(FP20("2").ln().toString());
      expect(FP20("16").log(2).toString()).toBe("4.00000000000000000000");
      expect(FP20("81").log(3).toString()).toBe("4.00000000000000000000");
    });

    test("log10", () => {
      expect(FP20("100").log10().toNumber()).toBeCloseTo(2, 14);
      expect(FP20("100").log10().toString()).toBe("2.00000000000000000000");
      expect(FP20("0.01").log10().toString()).toBe("-2.00000000000000000000");
    });

    test("log2", () => {
      expect(FP20("8").log2().toNumber()).toBeCloseTo(3, 14);
      expect(FP20("8").log2().toString()).toBe("3.00000000000000000000");
      expect(FP20("10").log2().toString()).toBe("3.32192809488736234787");
    });

    test("log domain validation", () => {
      expect(() => FP20("0").ln()).toThrow(
        "Logarithm is undefined for non-positive values",
      );
      expect(() => FP20("-1").log10()).toThrow(
        "Logarithm is undefined for non-positive values",
      );
      expect(() => FP20("10").log(1)).toThrow(
        "Logarithm base must be positive and not equal to 1",
      );
      expect(() => FP20("10").log(0)).toThrow(
        "Logarithm base must be positive and not equal to 1",
      );
    });

    test("scale", () => {
      expect(FP8("123.456789").scale(4).toString()).toBe("123.4568");
      expect(FP8("99.99999999").scale(0, 4).toString()).toBe("100");
      expect(FP2("1.23").scale(4).toString()).toBe("1.2300");
      const a = FP8("123.456789");
      a.scale(2);
      expect(a.toString()).toBe("123.45678900");
    });

    test("scale validation", () => {
      expect(() => FP8("123.456789").scale(-1)).toThrow(
        "newScale must be an integer between 0 and 20",
      );
      expect(() => FP8("123.456789").scale(21)).toThrow(
        "newScale must be an integer between 0 and 20",
      );
    });

    test("shiftedBy", () => {
      expect(FP8(1000n).shiftedBy(1).raw()).toBe(10000n);
      expect(FP8(1000n).shiftedBy(-1).raw()).toBe(100n);
      expect(FP8(1001n).shiftedBy(-1).raw()).toBe(100n);
    });

    test("static wrappers", () => {
      expect(FixedPrecision.abs("-2.5").toString()).toBe("2.50000000");
      expect(FixedPrecision.add("1.5", "2.25").toString()).toBe("3.75000000");
      expect(FixedPrecision.sub("5", "2.5").toString()).toBe("2.50000000");
      expect(FixedPrecision.mul("2.5", "4").toString()).toBe("10.00000000");
      expect(FixedPrecision.div("7.5", "2.5").toString()).toBe("3.00000000");
      expect(FixedPrecision.mod("10", "3").toString()).toBe("1.00000000");
      expect(FixedPrecision.pow("2", 3).toString()).toBe("8.00000000");
    });

    test("static rounding wrappers", () => {
      expect(FixedPrecision.ceil("1.1").toString()).toBe("2.00000000");
      expect(FixedPrecision.floor("1.9").toString()).toBe("1.00000000");
      expect(FixedPrecision.trunc("1.9").toString()).toBe("1.00000000");
      expect(FixedPrecision.round("1.2345", 2).toString()).toBe("1.23000000");
    });

    test("static log wrappers", () => {
      expect(FixedPrecision.ln("1").toString()).toBe("0");
      expect(FixedPrecision.log("8", "2").toString()).toBe("3.00000000");
      expect(FixedPrecision.log2("8").toString()).toBe("3.00000000");
      expect(FixedPrecision.log10("100").toString()).toBe("2.00000000");
    });

    test("static clamp", () => {
      expect(FixedPrecision.clamp(FP4("12"), "0", "10").toString()).toBe(
        "10.00000000",
      );
    });

    test("static exp", () => {
      fixedconfig.configure({ places: 20, roundingMode: 4 });
      try {
        expect(FixedPrecision.exp(2).toNumber()).toBeCloseTo(Math.exp(2), 14);
        expect(FixedPrecision.exp(2).toString()).toBe(
          "7.38905609893065022723",
        );
        expect(FixedPrecision.exp("2").toString()).toBe(
          FP20("2").exp().toString(),
        );
      } finally {
        fixedconfig.configure({ places: 8, roundingMode: 4 });
      }
    });

    test("chaining", () => {
      expect(FP8(10.5).add(5).div(3).toNumber()).toBeCloseTo((10.5 + 5) / 3);
      expect(
        FP8(100).add("50").sub(25).mul(2).div("5").toNumber(),
      ).toBeCloseTo(((100 + 50 - 25) * 2) / 5);
      expect(FP8(10.5).add(5).gt(15)).toBe(true);
      expect(FP8(10).mul(2).eq(20)).toBe(true);
    });
  });

  describe("Fraction", () => {
    test("num den", () => {
      const x = FP8("12.34");
      expect(x.num().toNumber()).toBe(617);
      expect(x.den().toNumber()).toBe(50);
      expect(x.num().div(x.den()).toString()).toBe("12.34000000");
    });

    test("negative num den", () => {
      const x = FP8("-1.5");
      expect(x.num().toNumber()).toBe(-3);
      expect(x.den().toNumber()).toBe(2);
    });

    test("toFraction", () => {
      const [num, den] = FP8("12.34").toFraction();
      expect(num.toNumber()).toBe(617);
      expect(den.toNumber()).toBe(50);
      expect(num.div(den).toString()).toBe("12.34000000");
    });

    test("toFraction with maxDen", () => {
      const [num, den] = FP8("0.33333333").toFraction(100);
      expect(num.toNumber()).toBe(1);
      expect(den.toNumber()).toBe(3);
    });

    test("toFraction validation", () => {
      expect(() => FP8("0.5").toFraction(0)).toThrow(
        "maxDen must be a positive integer",
      );
    });
  });

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
  });

  describe("String", () => {
    test("toExponential small", () => {
      expect(FP8("0.01234567").toExponential(4)).toContain("e");
    });

    test("toExponential large", () => {
      expect(FP8("12345678.00000000").toExponential(4)).toContain("e");
    });

    test("toPrecision moderate", () => {
      expect(Number(FP8("12.34567890").toPrecision(4))).toBeCloseTo(12.35, 1);
    });

    test("toPrecision small", () => {
      expect(Number(FP8("0.00123456").toPrecision(3))).toBeGreaterThan(0);
    });

    test("prec default half-up", () => {
      const x = FP8("9876.54321");
      expect(x.prec(2).toString()).toBe("9900.00000000");
      expect(x.prec(7).toString()).toBe("9876.54300000");
      expect(x.prec(20).toString()).toBe("9876.54321000");
    });

    test("prec down half-up", () => {
      const x = FP8("9876.54321");
      expect(x.prec(1, 1).toString()).toBe("9000.00000000");
      expect(x.prec(1, 4).toString()).toBe("10000.00000000");
    });

    test("prec no mutate", () => {
      const x = FP8("9876.54321");
      x.prec(2);
      expect(x.toString()).toBe("9876.54321000");
    });

    test("prec small negative", () => {
      expect(FP8("0.00123456").prec(2).toString()).toBe("0.00120000");
      expect(FP8("-9876.54321").prec(2).toString()).toBe("-9900.00000000");
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
      expect(v.toFixed(4)).toBe(v.scale(4).toString());
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
  });

  describe("Combinatorics", () => {
    test("factorial", () => {
      expect(FixedPrecision.factorial(5).toNumber()).toBe(120);
      expect(FixedPrecision.factorial(0).toNumber()).toBe(1);
      expect(() => FixedPrecision.factorial(-1)).toThrow();
    });

    test("permutations", () => {
      expect(FixedPrecision.permutations(5, 2).toNumber()).toBe(20);
      expect(FixedPrecision.permutations(5, 5).toNumber()).toBe(120);
      expect(FixedPrecision.permutations(5, 6).toNumber()).toBe(0);
      expect(() => FixedPrecision.permutations(-1, 2)).toThrow();
    });

    test("combinations", () => {
      expect(FixedPrecision.combinations(5, 2).toNumber()).toBe(10);
      expect(FixedPrecision.combinations(5, 3).toNumber()).toBe(10);
      expect(FixedPrecision.combinations(5, 5).toNumber()).toBe(1);
      expect(FixedPrecision.combinations(5, 6).toNumber()).toBe(0);
      expect(() => FixedPrecision.combinations(-1, 2)).toThrow();
    });
  });

  describe("Probability", () => {
    test("random in range", () => {
      const r = FixedPrecision.random().toNumber();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    });

    test("random decimal places", () => {
      const parts = FixedPrecision.random(8).toString().split(".");
      expect(parts[1]?.length).toBe(8);
    });
  });

  describe("Trigonometry", () => {
    test("sin cos tan zero", () => {
      expect(FP20("0").sin().toString()).toBe("0");
      expect(FP20("0").cos().toString()).toBe("1.00000000000000000000");
      expect(FP20("0").tan().toString()).toBe("0");
    });

    test("sin cos common angles", () => {
      expect(FP20(HALF_PI).sin().toNumber()).toBeCloseTo(1, 14);
      expect(FP20(PI).sin().toNumber()).toBeCloseTo(0, 14);
      expect(FP20(PI).cos().toNumber()).toBeCloseTo(-1, 14);
    });

    test("sin cos tan non-trivial", () => {
      for (const v of ["0.5", "0.75", "3.25"]) {
        const f = FP20(v);
        const n = Number(v);
        expect(f.sin().toNumber()).toBeCloseTo(Math.sin(n), 12);
        expect(f.cos().toNumber()).toBeCloseTo(Math.cos(n), 12);
        expect(f.tan().toNumber()).toBeCloseTo(Math.tan(n), 12);
      }
    });

    test("negative radians", () => {
      const f = FP8("-0.75");
      expect(f.sin().toNumber()).toBeCloseTo(Math.sin(-0.75), 7);
      expect(f.cos().toNumber()).toBeCloseTo(Math.cos(-0.75), 7);
      expect(f.tan().toNumber()).toBeCloseTo(Math.tan(-0.75), 7);
    });

    test("reciprocal", () => {
      const f = FP20("0.75");
      const n = 0.75;
      expect(f.sec().toNumber()).toBeCloseTo(1 / Math.cos(n), 12);
      expect(f.csc().toNumber()).toBeCloseTo(1 / Math.sin(n), 12);
      expect(f.cot().toNumber()).toBeCloseTo(1 / Math.tan(n), 12);
    });

    test("inverse", () => {
      expect(FP20("0.5").asin().toNumber()).toBeCloseTo(Math.asin(0.5), 12);
      expect(FP20("0.5").acos().toNumber()).toBeCloseTo(Math.acos(0.5), 12);
      expect(FP20("0.5").atan().toNumber()).toBeCloseTo(Math.atan(0.5), 12);
      expect(
        FP20("1").atan2(FP20("-1")).toNumber(),
      ).toBeCloseTo(Math.atan2(1, -1), 12);
      expect(FP20("2").acot().toNumber()).toBeCloseTo(Math.atan(1 / 2), 12);
      expect(FP20("2").asec().toNumber()).toBeCloseTo(Math.acos(1 / 2), 12);
      expect(FP20("2").acsc().toNumber()).toBeCloseTo(Math.asin(1 / 2), 12);
    });

    test("hyperbolic", () => {
      const f = FP20("0.5");
      const n = 0.5;
      expect(f.sinh().toNumber()).toBeCloseTo(Math.sinh(n), 12);
      expect(f.cosh().toNumber()).toBeCloseTo(Math.cosh(n), 12);
      expect(f.tanh().toNumber()).toBeCloseTo(Math.tanh(n), 12);
      expect(f.sech().toNumber()).toBeCloseTo(1 / Math.cosh(n), 12);
      expect(f.csch().toNumber()).toBeCloseTo(1 / Math.sinh(n), 12);
      expect(f.coth().toNumber()).toBeCloseTo(1 / Math.tanh(n), 12);
    });

    test("inverse hyperbolic", () => {
      expect(FP20("1.5").asinh().toNumber()).toBeCloseTo(Math.asinh(1.5), 12);
      expect(FP20("1.5").acosh().toNumber()).toBeCloseTo(Math.acosh(1.5), 12);
      expect(FP20("0.5").atanh().toNumber()).toBeCloseTo(Math.atanh(0.5), 12);
      expect(FP20("0.5").asech().toNumber()).toBeCloseTo(
        Math.acosh(1 / 0.5),
        12,
      );
      expect(FP20("2").acsch().toNumber()).toBeCloseTo(Math.asinh(1 / 2), 12);
      expect(FP20("2").acoth().toNumber()).toBeCloseTo(Math.atanh(1 / 2), 12);
    });

    test("domain validation", () => {
      expect(() => FP20("0").csc()).toThrow();
      expect(() => FP20("0").cot()).toThrow();
      expect(() => FP20("2").asin()).toThrow();
      expect(() => FP20("2").acos()).toThrow();
      expect(() => FP20("0.5").asec()).toThrow();
      expect(() => FP20("0.5").acsc()).toThrow();
      expect(() => FP20("0.5").acosh()).toThrow();
      expect(() => FP20("1").atanh()).toThrow();
      expect(() => FP20("2").asech()).toThrow();
      expect(() => FP20("0").acsch()).toThrow();
      expect(() => FP20("1").acoth()).toThrow();
      expect(() => FP20("0").csch()).toThrow();
      expect(() => FP20("0").coth()).toThrow();
    });

    test("static wrappers", () => {
      fixedconfig.configure({ places: 20, roundingMode: 4 });
      try {
        expect(FixedPrecision.sin("0.5").toString()).toBe(
          FP20("0.5").sin().toString(),
        );
        expect(FixedPrecision.cos("0.5").toString()).toBe(
          FP20("0.5").cos().toString(),
        );
        expect(FixedPrecision.tan("0.5").toString()).toBe(
          FP20("0.5").tan().toString(),
        );
        expect(FixedPrecision.atan2("1", "-1").toString()).toBe(
          FP20("1").atan2(FP20("-1")).toString(),
        );
        expect(FixedPrecision.acosh("1.5").toString()).toBe(
          FP20("1.5").acosh().toString(),
        );
      } finally {
        fixedconfig.configure({ places: 8, roundingMode: 4 });
      }
    });
  });

  describe("Factory", () => {
    test("independent precisions", () => {
      expect(FP8("1").toString()).toBe("1.00000000");
      expect(FP2("1").toString()).toBe("1.00");
    });

    test("cross-factory arithmetic throws", () => {
      expect(() => FP8("1").add(FP2("1"))).toThrow(
        "Cannot operate on different precisions",
      );
    });

    test("ignores global configure", () => {
      fixedconfig.configure({ places: 4 });
      expect(FP2("1").toString()).toBe("1.00");
      expect(new FixedPrecision("1").toString()).toBe("1.0000");
    });

    test("default rounding mode", () => {
      expect(FP8_DOWN("1.23456789").round(4).toString()).toBe("1.23450000");
      expect(FP8("1.23456781").round(4).toString()).toBe("1.23460000");
    });
  });

  describe("Configuration", () => {
    test("configure places", () => {
      fixedconfig.configure({ places: 10 });
      const a = new FixedPrecision("1.1234567891");
      expect(a.toString()).toBe("1.1234567891");
    });

    test("configure invalid places throws", () => {
      expect(() => fixedconfig.configure({ places: 25 })).toThrow(
        "Decimal places must be an integer between 0 and 20",
      );
    });

    test("configure rounding mode", () => {
      fixedconfig.configure({ places: 8, roundingMode: 2 });
      const a = new FixedPrecision("1.00000001");
      expect(a.ceil().toString()).toBe("2.00000000");
    });

    test("configure invalid rounding mode throws", () => {
      expect(() =>
        fixedconfig.configure({ places: 8, roundingMode: 9 as RoundingMode }),
      ).toThrow("Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8");
    });
  });
});
