import { describe, expect, test } from "vitest";

import FixedPrecision, {
  type FixedPrecisionConfig,
  fixedconfig,
  type RoundingMode,
} from "../src/FixedPrecision.js";

describe("FixedPrecision", () => {
  // ––– Existing Constructor Tests –––
  describe("Constructor", () => {
    test("accepts valid string with 8 decimals", () => {
      const a = new FixedPrecision(12345.67891234);
      expect(a.toString()).toBe("12345.67891234");
    });

    test("rounds string with >8 decimals using Number conversion", () => {
      const a = new FixedPrecision(0.123456789); // 9 decimals
      expect(a.toString()).toBe("0.12345678");
    });

    test("accepts number input", () => {
      const a = new FixedPrecision(42.12345678);
      expect(a.toString()).toBe("42.12345678");
    });

    test("accepts bigint input", () => {
      const a = new FixedPrecision("123456789");
      expect(a.toNumber()).toBe(123456789);
    });

    test("throws error for invalid string", () => {
      expect(() => new FixedPrecision("abc")).toThrow(
        "The number NaN cannot be converted to a BigInt because it is not an integer",
      );
    });
  });

  describe("toNumber() method", () => {
    test("toNumber() converts zero forms to positive zero", () => {
      const positiveZeroInputs = [
        "0",
        "0.0",
        "0.000000000000",
      ];
      const negativeZeroInputs = [
        "-0",
        "-0.0",
        "-0.000000000000",
      ];

      for (const input of [...positiveZeroInputs, ...negativeZeroInputs]) {
        const result = new FixedPrecision(input).toNumber();
        expect(result).toBe(0);
        expect(Object.is(result, -0)).toBe(false);
      }
    });

    test("toNumber() rejects non-finite numeric inputs", () => {
      const unsupportedInputs = [
        Infinity,
        "Infinity",
        -Infinity,
        "-Infinity",
        NaN,
        "NaN",
      ];

      for (const input of unsupportedInputs) {
        expect(() => new FixedPrecision(input).toNumber()).toThrow();
      }
    });

    test("toNumber() converts one forms and safe integer bounds", () => {
      const cases: Array<[string | number, number]> = [
        [1, 1],
        ["1", 1],
        ["1.0", 1],
        [-1, -1],
        ["-1", -1],
        ["-1.0", -1],
        ["9007199254740991", 9007199254740991],
        ["-9007199254740991", -9007199254740991],
      ];

      for (const [input, expected] of cases) {
        expect(new FixedPrecision(input).toNumber()).toBe(expected);
      }
    });

    test("toNumber() converts high precision finite decimal strings", () => {
      const FP15 = FixedPrecision.create({ places: 15 });
      expect(FP15("123.456789876543").toNumber()).toBe(123.456789876543);
      expect(FP15("-123.456789876543").toNumber()).toBe(-123.456789876543);
    });

    test("toNumber() preserves rounded high-precision values above MAX_SAFE_INTEGER", () => {
      const FP20 = FixedPrecision.create({ places: 20 });
      const rounded = FP20("499.99999999999994").round(4);

      expect(rounded.toString()).toBe("500.00000000000000000000");
      expect(rounded.toNumber()).toBe(500);
      expect(rounded.toNumber()).toBe(Number(rounded.toFixed(4)));
    });

    test("toNumber() handles lower-scale values above MAX_SAFE_INTEGER by parts", () => {
      const FP8 = FixedPrecision.create({ places: 8 });
      const positive = FP8("123456789.12345678");
      const negative = FP8("-123456789.12345678");

      expect(positive.raw() > BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(negative.raw() < -BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(positive.toNumber()).toBe(Number(positive.toString()));
      expect(negative.toNumber()).toBe(Number(negative.toString()));
    });

    test("toNumber(places) converts after scaling to the requested places", () => {
      const value = new FixedPrecision("1.255");

      expect(value.toNumber(2)).toBe(1.26);
      expect(value.toString()).toBe("1.25500000");
    });
  });

  // ––– Arithmetic Operations –––
  describe("Arithmetic Operations", () => {
    const a = new FixedPrecision("10.5");
    const b = new FixedPrecision("3.2");

    test("add() - positive values", () => {
      expect(a.add(b).toString()).toBe("13.70000000");
    });

    test("add() - add zero", () => {
      const zero = new FixedPrecision(0);
      expect(a.add(zero).toString()).toBe(a.toString());
    });

    test("sub() - result negative", () => {
      expect(b.sub(a).toString()).toBe("-7.30000000");
    });

    test("sub() - subtracting zero", () => {
      const zero = new FixedPrecision(0);
      expect(a.sub(zero).toString()).toBe(a.toString());
    });

    test("mul() - with scaling", () => {
      const result = a.mul(b);
      expect(result.toString()).toBe("33.60000000");
    });

    test("mul() - multiplication by one", () => {
      const one = new FixedPrecision(1);
      expect(a.mul(one).toString()).toBe(a.toString());
    });

    test("div() - precise division", () => {
      const result = a.div(b);
      expect(result.toFixed(2)).toBe("3.28");
    });

    test("div() - dividing a number by itself yields one", () => {
      const result = a.div(a);
      expect(result.toString()).toBe("1.00000000");
    });

    test("div() throws on zero", () => {
      const zero = new FixedPrecision(0);
      expect(() => a.div(zero)).toThrow("Division by zero");
    });

    test("mod() - positive remainder", () => {
      const x = new FixedPrecision("10");
      const y = new FixedPrecision("3");
      expect(x.mod(y).toString()).toBe("1.00000000");
    });

    test("mod() - remainder of zero", () => {
      const x = new FixedPrecision("10");
      const y = new FixedPrecision("5");
      expect(x.mod(y).toString()).toBe("0.00000000");
    });

    test("product() - large multiplication", () => {
      const big = new FixedPrecision("100000000");
      const result = big.product(big);
      expect(result.toString()).toBe("1000000000000000000000000.00000000");
    });

    test("product() - product with one", () => {
      const one = new FixedPrecision(1);
      expect(a.product(one).toString()).toBe("1050000000.00000000");
    });

    test("idiv() truncates division toward zero", () => {
      expect(new FixedPrecision("7.5").idiv(2).toString()).toBe(
        "3.00000000",
      );
      expect(new FixedPrecision("-7.5").idiv(2).toString()).toBe(
        "-3.00000000",
      );
    });

    test("dividedToIntegerBy() aliases idiv()", () => {
      const value = new FixedPrecision("7.5");
      expect(value.dividedToIntegerBy(2).toString()).toBe(
        value.idiv(2).toString(),
      );
    });

    test("clamp() limits values to the provided interval", () => {
      expect(new FixedPrecision("5").clamp(0, 10).toString()).toBe(
        "5.00000000",
      );
      expect(new FixedPrecision("-1").clamp(0, 10).toString()).toBe(
        "0.00000000",
      );
      expect(new FixedPrecision("11").clamp(0, 10).toString()).toBe(
        "10.00000000",
      );
    });

    test("clampedTo() aliases clamp() and validates interval order", () => {
      const value = new FixedPrecision("5");
      expect(value.clampedTo(0, 10).toString()).toBe(
        value.clamp(0, 10).toString(),
      );
      expect(() => value.clamp(10, 0)).toThrow(
        "min must be less than or equal to max",
      );
    });

    test("toNearest() rounds to the nearest multiple", () => {
      expect(new FixedPrecision("5.5").toNearest(2).toString()).toBe(
        "6.00000000",
      );
      expect(new FixedPrecision("5").toNearest(2, 1).toString()).toBe(
        "4.00000000",
      );
      expect(new FixedPrecision("-5").toNearest(2).toString()).toBe(
        "-6.00000000",
      );
      expect(() => new FixedPrecision("5").toNearest(0)).toThrow(
        "Increment must be non-zero",
      );
    });
  });

  // ––– Comparison and Sign Functions –––
  describe("Comparison Functions", () => {
    test("cmp() returns 0 for equal values", () => {
      const a = new FixedPrecision("5.00000000");
      const b = new FixedPrecision(5);
      expect(a.cmp(b)).toBe(0);
    });

    test("cmp() returns -1 for smaller and 1 for larger value", () => {
      const a = new FixedPrecision("4.99999999");
      const b = new FixedPrecision("5.00000000");
      expect(a.cmp(b)).toBe(-1);
      expect(b.cmp(a)).toBe(1);
    });

    test("eq() returns true for equal values", () => {
      const a = new FixedPrecision("123.45678900");
      const b = new FixedPrecision("123.45678900");
      expect(a.eq(b)).toBe(true);
    });

    test("eq() returns false for unequal values", () => {
      const a = new FixedPrecision("123.45678900");
      const b = new FixedPrecision("123.45678899");
      expect(a.eq(b)).toBe(false);
    });

    test("gt(), gte(), lt(), lte() function correctly", () => {
      const a = new FixedPrecision("10.00000000");
      const b = new FixedPrecision("9.99999999");
      expect(a.gt(b)).toBe(true);
      expect(a.gte(b)).toBe(true);
      expect(b.lt(a)).toBe(true);
      expect(b.lte(a)).toBe(true);
    });

    test("gt() and lt() for equal values", () => {
      const a = new FixedPrecision("100.00000000");
      const b = new FixedPrecision("100.00000000");
      expect(a.gt(b)).toBe(false);
      expect(a.lt(b)).toBe(false);
      expect(a.gte(b)).toBe(true);
      expect(a.lte(b)).toBe(true);
    });
  });

  describe("Sign Check Functions", () => {
    test("isZero() returns true for zero", () => {
      const zero = new FixedPrecision(0);
      expect(zero.isZero()).toBe(true);
    });

    test("isZero() returns false for non-zero", () => {
      const num = new FixedPrecision("0.00000001");
      expect(num.isZero()).toBe(false);
    });

    test("isPositive() returns true for positive number", () => {
      const num = new FixedPrecision("1.00000000");
      expect(num.isPositive()).toBe(true);
    });

    test("isPositive() returns false for negative number", () => {
      const num = new FixedPrecision("-1.00000000");
      expect(num.isPositive()).toBe(false);
    });

    test("isNegative() returns true for negative number", () => {
      const num = new FixedPrecision("-0.00000001");
      expect(num.isNegative()).toBe(true);
    });

    test("isNegative() returns false for positive number", () => {
      const num = new FixedPrecision("0.00000001");
      expect(num.isNegative()).toBe(false);
    });
  });

  describe("Logical Functions", () => {
    test("instance logical methods use zero and non-zero truthiness", () => {
      const zero = new FixedPrecision(0);
      const one = new FixedPrecision(1);
      const negative = new FixedPrecision("-0.00000001");

      expect(zero.not()).toBe(true);
      expect(one.not()).toBe(false);
      expect(one.and(negative)).toBe(true);
      expect(one.and(0)).toBe(false);
      expect(one.and(zero)).toBe(false);
      expect(zero.or(negative)).toBe(true);
      expect(zero.or(0)).toBe(false);
      expect(zero.or(one)).toBe(true);
      expect(one.xor(0)).toBe(true);
      expect(one.xor(negative)).toBe(false);
    });

    test("static logical methods accept primitives, booleans, and FixedPrecision", () => {
      const FP4 = FixedPrecision.create({ places: 4 });

      expect(FixedPrecision.not(0)).toBe(true);
      expect(FixedPrecision.not("0.00000001")).toBe(false);
      expect(FixedPrecision.and("2", `2`)).toBe(true);
      expect(FixedPrecision.and("0", `1`)).toBe(false);
      expect(FixedPrecision.or('0', new FixedPrecision("-1"))).toBe(true);
      expect(FixedPrecision.xor("0", "3")).toBe(true);
      expect(FixedPrecision.xor('1', "3")).toBe(false);
      expect(FixedPrecision.and(FP4("0.0001"), "1")).toBe(true);
    });
  });

  describe("Static instance method wrappers", () => {
    test("arithmetic wrappers call the matching instance methods", () => {
      expect(FixedPrecision.abs("-2.5").toString()).toBe("2.50000000");
      expect(FixedPrecision.add("1.5", "2.25").toString()).toBe(
        "3.75000000",
      );
      expect(FixedPrecision.sub("5", "2.5").toString()).toBe("2.50000000");
      expect(FixedPrecision.mul("2.5", "4").toString()).toBe("10.00000000");
      expect(FixedPrecision.div("7.5", "2.5").toString()).toBe("3.00000000");
      expect(FixedPrecision.mod("10", "3").toString()).toBe("1.00000000");
      expect(FixedPrecision.pow("2", 3).toString()).toBe("8.00000000");
    });

    test("rounding wrappers call the matching instance methods", () => {
      expect(FixedPrecision.ceil("1.1").toString()).toBe("2.00000000");
      expect(FixedPrecision.floor("1.9").toString()).toBe("1.00000000");
      expect(FixedPrecision.trunc("1.9").toString()).toBe("1.00000000");
      expect(FixedPrecision.round("1.2345", 2).toString()).toBe("1.23000000");
    });

    test("logarithm wrappers call the matching instance methods", () => {
      expect(FixedPrecision.ln("1").toString()).toBe("0.00000000");
      expect(FixedPrecision.log("8", "2").toString()).toBe("3.00000000");
      expect(FixedPrecision.log2("8").toString()).toBe("3.00000000");
      expect(FixedPrecision.log10("100").toString()).toBe("2.00000000");
    });

    test("clamp wrapper normalizes FixedPrecision values to default context", () => {
      const FP4 = FixedPrecision.create({ places: 4 });
      expect(FixedPrecision.clamp(FP4("12"), "0", "10").toString()).toBe(
        "10.00000000",
      );
    });
  });

  describe("Inspection methods", () => {
    test("isInteger() checks whether there is a fractional remainder", () => {
      expect(new FixedPrecision("10.00000000").isInteger()).toBe(true);
      expect(new FixedPrecision("10.00000001").isInteger()).toBe(false);
    });

    test("places() and decimalPlaces() return the instance scale", () => {
      const FP4 = FixedPrecision.create({ places: 4 });
      const value = FP4("1.23");

      expect(value.places()).toBe(4);
      expect(value.decimalPlaces()).toBe(4);
    });

    test("precision() returns significant digits", () => {
      expect(new FixedPrecision("123.450000").precision()).toBe(5);
      expect(new FixedPrecision("0.00123000").precision()).toBe(3);
      expect(new FixedPrecision("1000").precision()).toBe(1);
      expect(new FixedPrecision("0").precision()).toBe(1);
    });

    test("precision(true) includes integer trailing zeros", () => {
      const value = new FixedPrecision("1000");

      expect(value.precision(true)).toBe(4);
      expect(value.sd(true)).toBe(4);
    });

    test("FixedPrecision.isFixedPrecision() identifies instances", () => {
      const value = new FixedPrecision("1");

      expect(FixedPrecision.isFixedPrecision(value)).toBe(true);
      expect(FixedPrecision.isFixedPrecision("1")).toBe(false);
    });

    test("FixedPrecision.sign() returns numeric signs", () => {
      expect(FixedPrecision.sign(new FixedPrecision("2"))).toBe(1);
      expect(FixedPrecision.sign("-2")).toBe(-1);
      expect(FixedPrecision.sign("0")).toBe(0);
      expect(Object.is(FixedPrecision.sign(-0), -0)).toBe(true);
      expect(Object.is(FixedPrecision.sign("-0.0"), -0)).toBe(true);
      expect(Number.isNaN(FixedPrecision.sign(NaN))).toBe(true);
    });
  });

  describe("neg() method", () => {
    test("neg() negates positive number", () => {
      const a = new FixedPrecision("42.00000000");
      const negA = a.neg();
      expect(negA.toString()).toBe("-42.00000000");
    });

    test("neg() negates negative number", () => {
      const a = new FixedPrecision("-42.00000000");
      const negA = a.neg();
      expect(negA.toString()).toBe("42.00000000");
    });
  });

  describe("pow() method", () => {
    test("pow() with positive exponent", () => {
      const a = new FixedPrecision("2.00000000");
      const result = a.pow(3); // 2^3 = 8
      expect(result.toString()).toBe("8.00000000");
    });

    test("pow() with negative exponent", () => {
      const a = new FixedPrecision("2.00000000");
      const result = a.pow(-2); // 2^-2 = 0.25
      expect(result.toFixed(8)).toBe("0.25000000");
    });
  });

  describe("square() and cube() methods", () => {
    test("square() returns the value raised to the second power", () => {
      const a = new FixedPrecision("3.50000000");
      expect(a.square().toString()).toBe("12.25000000");
    });

    test("cube() returns the value raised to the third power", () => {
      const a = new FixedPrecision("2.50000000");
      expect(a.cube().toString()).toBe("15.62500000");
    });

    test("static square() and cube() use the default context", () => {
      expect(FixedPrecision.square("3.5").toString()).toBe("12.25000000");
      expect(FixedPrecision.cube("2.5").toString()).toBe("15.62500000");
    });
  });

  describe("sqrt() method", () => {
    test("sqrt() of a perfect square", () => {
      const a = new FixedPrecision("9.00000000");
      const result = a.sqrt();
      expect(result.toFixed(8)).toBe("3.00000000");
    });

    test("sqrt() of a non-perfect square approximates correctly", () => {
      const a = new FixedPrecision("2.00000000");
      const result = a.sqrt();
      expect(Number(result.toFixed(8))).toBeCloseTo(1.41421356, 7);
    });

    test("sqrt() of zero returns zero", () => {
      const a = new FixedPrecision(0);
      const result = a.sqrt();
      expect(result.toString()).toBe("0.00000000");
    });

    test("FixedPrecision.sqrt() returns square root using default context", () => {
      expect(FixedPrecision.sqrt("9").toString()).toBe("3.00000000");
      expect(FixedPrecision.sqrt("2").toNumber()).toBeCloseTo(Math.sqrt(2), 7);
    });
  });

  describe("cbrt() method", () => {
    test("cbrt() of a perfect cube", () => {
      const a = new FixedPrecision("27.00000000");
      expect(a.cbrt().toFixed(8)).toBe("3.00000000");
    });

    test("cbrt() of a non-perfect cube approximates correctly", () => {
      const a = new FixedPrecision("2.00000000");
      expect(a.cbrt().toNumber()).toBeCloseTo(Math.cbrt(2), 7);
    });

    test("cbrt() handles negative values", () => {
      const a = new FixedPrecision("-8.00000000");
      expect(a.cbrt().toString()).toBe("-2.00000000");
    });

    test("cubeRoot() aliases cbrt()", () => {
      const a = new FixedPrecision("125.00000000");
      expect(a.cubeRoot().toString()).toBe(a.cbrt().toString());
    });

    test("FixedPrecision.cbrt() and cubeRoot() use default context", () => {
      expect(FixedPrecision.cbrt("64").toString()).toBe("4.00000000");
      expect(FixedPrecision.cubeRoot("64").toString()).toBe("4.00000000");
    });
  });

  describe("transcendental methods", () => {
    const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

    test("ln() returns natural logarithm", () => {
      const result = FP20("2.71828182845904523536").ln();
      expect(result.toNumber()).toBeCloseTo(1, 14);
      expect(result.toString()).toBe("0.99999999999999999999");
    });

    test("ln() keeps guard-digit precision for non-trivial values", () => {
      expect(FP20("10").ln().toString()).toBe("2.30258509299404568401");
      expect(FP20("123.456789").ln().toString()).toBe("4.81589120820374401402");
    });

    test("log() defaults to natural logarithm", () => {
      const value = FP20("2");
      expect(value.log().toNumber()).toBeCloseTo(Math.log(2), 14);
      expect(value.log().toString()).toBe(value.ln().toString());
      expect(value.log().toString()).toBe("0.69314718055994530941");
    });

    test("log() accepts an explicit base", () => {
      const result = FP20("16").log(2);
      expect(result.toNumber()).toBeCloseTo(4, 14);
      expect(result.toString()).toBe("4.00000000000000000000");
    });

    test("log() keeps guard-digit precision for exact integer results", () => {
      expect(FP20("81").log(3).toString()).toBe("4.00000000000000000000");
    });

    test("log10() returns base-10 logarithm", () => {
      expect(FP20("100").log10().toNumber()).toBeCloseTo(2, 14);
      expect(FP20("100").log10().toString()).toBe("2.00000000000000000000");
      expect(FP20("0.01").log10().toString()).toBe("-2.00000000000000000000");
    });

    test("log2() returns base-2 logarithm", () => {
      const result = FP20("8").log2();
      expect(result.toNumber()).toBeCloseTo(3, 14);
      expect(result.toString()).toBe("3.00000000000000000000");
    });

    test("log2() keeps guard-digit precision for non-powers of two", () => {
      expect(FP20("10").log2().toString()).toBe("3.32192809488736234787");
    });

    test("exp() returns e raised to the value", () => {
      expect(FP20("1").exp().toNumber()).toBeCloseTo(Math.E, 14);
      expect(FP20("1").exp().toString()).toBe("2.71828182845904523536");
      expect(FP20("-1").exp().toNumber()).toBeCloseTo(Math.exp(-1), 14);
      expect(FP20("-1").exp().toString()).toBe("0.36787944117144232159");
    });

    test("FixedPrecision.exp() returns e raised to the argument", () => {
      fixedconfig.configure({ places: 20, roundingMode: 4 });
      try {
        expect(FixedPrecision.exp(2).toNumber()).toBeCloseTo(Math.exp(2), 14);
        expect(FixedPrecision.exp(2).toString()).toBe("7.38905609893065022723");
        expect(FixedPrecision.exp("2").toString()).toBe(
          FP20("2").exp().toString(),
        );
      } finally {
        fixedconfig.configure({ places: 8, roundingMode: 4 });
      }
    });

    test("log methods validate domain and base", () => {
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
  });

  describe("trigonometry methods", () => {
    const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });
    const PI = "3.14159265358979323846";
    const HALF_PI = "1.57079632679489661923";

    test("sin(), cos(), and tan() handle zero", () => {
      const zero = FP20("0");

      expect(zero.sin().toString()).toBe("0.00000000000000000000");
      expect(zero.cos().toString()).toBe("1.00000000000000000000");
      expect(zero.tan().toString()).toBe("0.00000000000000000000");
    });

    test("sin() and cos() handle common radian angles", () => {
      expect(FP20(HALF_PI).sin().toNumber()).toBeCloseTo(1, 14);
      expect(FP20(PI).sin().toNumber()).toBeCloseTo(0, 14);
      expect(FP20(PI).cos().toNumber()).toBeCloseTo(-1, 14);
    });

    test("trigonometry methods match Math for non-trivial radians", () => {
      const values = ["0.5", "0.75", "3.25"];

      for (const value of values) {
        const fixed = FP20(value);
        const numeric = Number(value);

        expect(fixed.sin().toNumber()).toBeCloseTo(Math.sin(numeric), 12);
        expect(fixed.cos().toNumber()).toBeCloseTo(Math.cos(numeric), 12);
        expect(fixed.tan().toNumber()).toBeCloseTo(Math.tan(numeric), 12);
      }
    });

    test("trigonometry methods handle negative radians", () => {
      const fixed = new FixedPrecision("-0.75");

      expect(fixed.sin().toNumber()).toBeCloseTo(Math.sin(-0.75), 7);
      expect(fixed.cos().toNumber()).toBeCloseTo(Math.cos(-0.75), 7);
      expect(fixed.tan().toNumber()).toBeCloseTo(Math.tan(-0.75), 7);
    });

    test("reciprocal trigonometry methods match their definitions", () => {
      const fixed = FP20("0.75");
      const numeric = 0.75;

      expect(fixed.sec().toNumber()).toBeCloseTo(1 / Math.cos(numeric), 12);
      expect(fixed.csc().toNumber()).toBeCloseTo(1 / Math.sin(numeric), 12);
      expect(fixed.cot().toNumber()).toBeCloseTo(1 / Math.tan(numeric), 12);
    });

    test("inverse trigonometry methods match Math", () => {
      const half = FP20("0.5");
      const two = FP20("2");

      expect(half.asin().toNumber()).toBeCloseTo(Math.asin(0.5), 12);
      expect(half.acos().toNumber()).toBeCloseTo(Math.acos(0.5), 12);
      expect(half.atan().toNumber()).toBeCloseTo(Math.atan(0.5), 12);
      expect(FP20("1").atan2(FP20("-1")).toNumber()).toBeCloseTo(
        Math.atan2(1, -1),
        12,
      );
      expect(two.acot().toNumber()).toBeCloseTo(Math.atan(1 / 2), 12);
      expect(two.asec().toNumber()).toBeCloseTo(Math.acos(1 / 2), 12);
      expect(two.acsc().toNumber()).toBeCloseTo(Math.asin(1 / 2), 12);
    });

    test("hyperbolic methods match Math", () => {
      const fixed = FP20("0.5");
      const numeric = 0.5;

      expect(fixed.sinh().toNumber()).toBeCloseTo(Math.sinh(numeric), 12);
      expect(fixed.cosh().toNumber()).toBeCloseTo(Math.cosh(numeric), 12);
      expect(fixed.tanh().toNumber()).toBeCloseTo(Math.tanh(numeric), 12);
      expect(fixed.sech().toNumber()).toBeCloseTo(1 / Math.cosh(numeric), 12);
      expect(fixed.csch().toNumber()).toBeCloseTo(1 / Math.sinh(numeric), 12);
      expect(fixed.coth().toNumber()).toBeCloseTo(1 / Math.tanh(numeric), 12);
    });

    test("inverse hyperbolic methods match Math", () => {
      const half = FP20("0.5");
      const onePointFive = FP20("1.5");
      const two = FP20("2");

      expect(onePointFive.asinh().toNumber()).toBeCloseTo(
        Math.asinh(1.5),
        12,
      );
      expect(onePointFive.acosh().toNumber()).toBeCloseTo(
        Math.acosh(1.5),
        12,
      );
      expect(half.atanh().toNumber()).toBeCloseTo(Math.atanh(0.5), 12);
      expect(half.asech().toNumber()).toBeCloseTo(Math.acosh(1 / 0.5), 12);
      expect(two.acsch().toNumber()).toBeCloseTo(Math.asinh(1 / 2), 12);
      expect(two.acoth().toNumber()).toBeCloseTo(Math.atanh(1 / 2), 12);
    });

    test("trigonometry methods validate domains", () => {
      expect(() => FP20("0").csc()).toThrow("Cosecant is undefined for zero");
      expect(() => FP20("0").cot()).toThrow(
        "Cotangent is undefined when sine is zero",
      );
      expect(() => FP20("2").asin()).toThrow("Arcsine is defined");
      expect(() => FP20("2").acos()).toThrow("Arccosine is defined");
      expect(() => FP20("0.5").asec()).toThrow("Arcsecant is defined");
      expect(() => FP20("0.5").acsc()).toThrow("Arccosecant is defined");
      expect(() => FP20("0.5").acosh()).toThrow(
        "Hyperbolic arccosine is defined",
      );
      expect(() => FP20("1").atanh()).toThrow(
        "Hyperbolic arctangent is defined",
      );
      expect(() => FP20("2").asech()).toThrow(
        "Hyperbolic arcsecant is defined",
      );
      expect(() => FP20("0").acsch()).toThrow(
        "Hyperbolic arccosecant is undefined for zero",
      );
      expect(() => FP20("1").acoth()).toThrow(
        "Hyperbolic arccotangent is defined",
      );
      expect(() => FP20("0").csch()).toThrow(
        "Hyperbolic cosecant is undefined for zero",
      );
      expect(() => FP20("0").coth()).toThrow(
        "Hyperbolic cotangent is undefined for zero",
      );
    });

    test("static trigonometry methods use the default context", () => {
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

  // ––– Rounding and Formatting Methods –––
  describe("Rounding Methods", () => {
    describe("ceil()", () => {
      test("ceil() rounds up positive decimals", () => {
        const a = new FixedPrecision("1.00000001");
        expect(a.ceil().toString()).toBe("2.00000000");
      });
      test("ceil() rounds toward zero for negatives", () => {
        const a = new FixedPrecision("-1.00000001");
        expect(a.ceil().toString()).toBe("-1.00000000");
      });
    });

    describe("floor()", () => {
      test("floor() rounds down positive decimals", () => {
        const a = new FixedPrecision("1.99999999");
        expect(a.floor().toString()).toBe("1.00000000");
      });
      test("floor() rounds away from zero for negatives", () => {
        const a = new FixedPrecision("-1.00000001");
        expect(a.floor().toString()).toBe("-2.00000000");
      });
    });

    describe("trunc()", () => {
      test("trunc() truncates positive decimals", () => {
        const a = new FixedPrecision("1.98765432");
        expect(a.trunc().toString()).toBe("1.00000000");
      });
      test("trunc() truncates negative decimals", () => {
        const a = new FixedPrecision("-1.98765432");
        expect(a.trunc().toString()).toBe("-1.00000000");
      });
    });

    describe("round()", () => {
      test("round() rounds to specified decimal places with default mode", () => {
        const a = new FixedPrecision("1.23456789");
        expect(a.round(4).toString()).toBe("1.23460000");
      });
      test("round() rounds with explicit rounding mode", () => {
        // Using ROUND_DOWN (4) explicitly
        const a = new FixedPrecision("1.23456789");
        expect(a.round(4, 1).toString()).toBe("1.23450000");
      });
      test("round() handles half-up positive and negative ties", () => {
        expect(new FixedPrecision("1.23455000").round(4, 4).toString()).toBe(
          "1.23460000",
        );
        expect(new FixedPrecision("-1.23455000").round(4, 4).toString()).toBe(
          "-1.23460000",
        );
      });
      test("round() keeps the original context scale", () => {
        const rounded = new FixedPrecision("1.23456789").round(2);
        expect(rounded.toString()).toBe("1.23000000");
      });
    });
  });

  describe("shiftedBy() method", () => {
    test("shiftedBy() multiplies raw bigint by powers of ten with positive n", () => {
      const shifted = new FixedPrecision(1000n).shiftedBy(1);
      expect(shifted.raw()).toBe(10000n);
    });
    test("shiftedBy() divides raw bigint by powers of ten with negative n", () => {
      const shifted = new FixedPrecision(1000n).shiftedBy(-1);
      expect(shifted.raw()).toBe(100n);
    });
    test("shiftedBy() accepts inexact negative shift", () => {
      const a = new FixedPrecision(1001n);
      expect(a.shiftedBy(-1).raw()).toBe(100n);
    });
  });

  describe("random() method", () => {
    test("random() produces a value ≥ 0 and < 1", () => {
      const rnd = FixedPrecision.random();
      const num = rnd.toNumber();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    });
    test("random() produces a value with correct number of decimals", () => {
      const rnd = FixedPrecision.random(8);
      const parts = rnd.toString().split(".");
      expect(parts[1]).toBeDefined();
      expect(parts[1]?.length).toBe(8);
    });
  });

  describe("Static min() and max()", () => {
    test("min() with single argument returns that value", () => {
      const result = FixedPrecision.min("5.5");
      expect(result.toString()).toBe("5.50000000");
    });

    test("min() returns the smaller of two values", () => {
      const result = FixedPrecision.min("10.5", "3.2");
      expect(result.toNumber()).toBe(3.2);
    });

    test("min() returns the minimum among multiple values", () => {
      const result = FixedPrecision.min("5.0", "3.0", "7.0", "1.0", "4.0");
      expect(result.toNumber()).toBe(1.0);
    });

    test("min() with negative values", () => {
      const result = FixedPrecision.min("-5.0", "-10.0", "3.0");
      expect(result.toNumber()).toBe(-10.0);
    });

    test("min() with FixedPrecision instances", () => {
      const a = new FixedPrecision("100.5");
      const b = new FixedPrecision("50.25");
      const result = FixedPrecision.min(a, b);
      expect(result.toNumber()).toBe(50.25);
    });

    test("min() with mixed primitives and FixedPrecision", () => {
      const a = new FixedPrecision("10.0");
      const result = FixedPrecision.min(a, "5.5", 3.0);
      expect(result.toNumber()).toBe(3.0);
    });

    test("min() normalizes values from different contexts to default", () => {
      const FP4 = FixedPrecision.create({ places: 4 });
      const a = FP4("100.5");
      const result = FixedPrecision.min(a, "50.25");
      expect(result.toString()).toBe("50.25000000");
    });

    test("max() with single argument returns that value", () => {
      const result = FixedPrecision.max("-3.5");
      expect(result.toString()).toBe("-3.50000000");
    });

    test("max() returns the larger of two values", () => {
      const result = FixedPrecision.max("10.5", "3.2");
      expect(result.toNumber()).toBe(10.5);
    });

    test("max() returns the maximum among multiple values", () => {
      const result = FixedPrecision.max("1.0", "3.0", "7.0", "5.0", "2.0");
      expect(result.toNumber()).toBe(7.0);
    });

    test("max() with negative values", () => {
      const result = FixedPrecision.max("-5.0", "-10.0", "-3.0");
      expect(result.toNumber()).toBe(-3.0);
    });

    test("max() with FixedPrecision instances", () => {
      const a = new FixedPrecision("50.25");
      const b = new FixedPrecision("100.5");
      const result = FixedPrecision.max(a, b);
      expect(result.toNumber()).toBe(100.5);
    });

    test("max() with mixed primitives and FixedPrecision", () => {
      const a = new FixedPrecision("10.0");
      const result = FixedPrecision.max(a, "5.5", 3.0);
      expect(result.toNumber()).toBe(10.0);
    });

    test("min() with equal values returns that value", () => {
      const result = FixedPrecision.min("5.0", "5.0", "5.0");
      expect(result.toNumber()).toBe(5.0);
    });

    test("max() with equal values returns that value", () => {
      const result = FixedPrecision.max("5.0", "5.0", "5.0");
      expect(result.toNumber()).toBe(5.0);
    });

    test("min() accepts an array", () => {
      const result = FixedPrecision.min([2, 1, 4, 3]);
      expect(result.toNumber()).toBe(1);
    });

    test("max() accepts an array", () => {
      const result = FixedPrecision.max([2, 1, 4, 3]);
      expect(result.toNumber()).toBe(4);
    });

    test("min() throws on empty array", () => {
      expect(() => FixedPrecision.min([])).toThrow(
        "FixedPrecision.min requires at least one argument",
      );
    });

    test("max() throws on empty array", () => {
      expect(() => FixedPrecision.max([])).toThrow(
        "FixedPrecision.max requires at least one argument",
      );
    });
  });

  describe("Static sum()", () => {
    test("sum() adds multiple values", () => {
      const result = FixedPrecision.sum("2.5", "3.5", "1.0");
      expect(result.toNumber()).toBe(7.0);
    });

    test("sum() with single argument returns that value", () => {
      const result = FixedPrecision.sum("5.5");
      expect(result.toNumber()).toBe(5.5);
    });

    test("sum() accepts an array", () => {
      const result = FixedPrecision.sum([1, 2, 3, 4]);
      expect(result.toNumber()).toBe(10);
    });

    test("sum() with negative values", () => {
      const result = FixedPrecision.sum("10.0", "-3.0", "-2.0");
      expect(result.toNumber()).toBe(5.0);
    });

    test("sum() with FixedPrecision instances and primitives", () => {
      const a = new FixedPrecision("10.5");
      const result = FixedPrecision.sum(a, "5.25", 3.0);
      expect(result.toNumber()).toBe(18.75);
    });

    test("sum() normalizes values from different contexts", () => {
      const FP4 = FixedPrecision.create({ places: 4 });
      const a = FP4("10.50");
      const result = FixedPrecision.sum(a, "20.25");
      expect(result.toString()).toBe("30.75000000");
    });

    test("sum() returns zero for empty array", () => {
      const result = FixedPrecision.sum([]);
      expect(result.toNumber()).toBe(0);
    });
  });

  describe("Static hypot()", () => {
    test("hypot() returns sqrt(sum(v^2))", () => {
      expect(FixedPrecision.hypot(3, 4).toString()).toBe("5.00000000");
      expect(FixedPrecision.hypot("1", "2", "2").toString()).toBe(
        "3.00000000",
      );
    });

    test("hypot() accepts arrays and returns zero with no values", () => {
      expect(FixedPrecision.hypot([6, 8]).toString()).toBe("10.00000000");
      expect(FixedPrecision.hypot().toString()).toBe("0.00000000");
    });

    test("hypot() normalizes values to the default context", () => {
      const FP4 = FixedPrecision.create({ places: 4 });
      expect(FixedPrecision.hypot(FP4("3"), "4").toString()).toBe(
        "5.00000000",
      );
    });
  });

  describe("Formatting Methods", () => {
    describe("toExponential()", () => {
      test("toExponential() produces correct format for a small number", () => {
        const a = new FixedPrecision("0.01234567");
        const expStr = a.toExponential(4);
        expect(expStr).toContain("e");
      });
      test("toExponential() produces correct format for a large number", () => {
        const a = new FixedPrecision("12345678.00000000");
        const expStr = a.toExponential(4);
        expect(expStr).toContain("e");
      });
    });

    describe("toPrecision()", () => {
      test("toPrecision() produces correct precision for a moderate number", () => {
        const a = new FixedPrecision("12.34567890");
        const prec = a.toPrecision(4);
        expect(Number(prec)).toBeCloseTo(12.35, 1);
      });
      test("toPrecision() for a small number returns a positive value", () => {
        const a = new FixedPrecision("0.00123456");
        const prec = a.toPrecision(3);
        expect(Number(prec)).toBeGreaterThan(0);
      });
    });

    describe("prec()", () => {
      const down = 1;
      const halfUp = 4;

      test("prec() rounds to significant digits with half-up by default", () => {
        const x = new FixedPrecision("9876.54321");
        expect(x.prec(2).toString()).toBe("9900.00000000");
        expect(x.prec(7).toString()).toBe("9876.54300000");
        expect(x.prec(20).toString()).toBe("9876.54321000");
      });
      test("prec() supports down and half-up modes", () => {
        const x = new FixedPrecision("9876.54321");
        expect(x.prec(1, down).toString()).toBe("9000.00000000");
        expect(x.prec(1, halfUp).toString()).toBe("10000.00000000");
      });
      test("prec() does not mutate the original value", () => {
        const x = new FixedPrecision("9876.54321");
        x.prec(2);
        expect(x.toString()).toBe("9876.54321000");
      });
      test("prec() handles small and negative values", () => {
        expect(new FixedPrecision("0.00123456").prec(2).toString()).toBe(
          "0.00120000",
        );
        expect(new FixedPrecision("-9876.54321").prec(2).toString()).toBe(
          "-9900.00000000",
        );
      });
      test("prec() validates significant digits and rounding mode", () => {
        const x = new FixedPrecision("9876.54321");
        expect(() => x.prec(0)).toThrow("Precision must be a positive integer");
        expect(() => x.prec(2, 9 as RoundingMode)).toThrow(
          "Rounding mode 9 is not supported.",
        );
      });
    });

    describe("toFixed()", () => {
      test("toFixed() produces correct output with 0 places", () => {
        const a = new FixedPrecision("123.456789");
        expect(a.toFixed(0)).toBe("123");
      });
      test("toFixed() produces correct output with multiple places", () => {
        const a = new FixedPrecision("123.456789");
        expect(a.toFixed(3)).toBe("123.457");
      });
    });

    describe("base conversion methods", () => {
      test("toBinary(), toOctal(), and toHex() convert finite fractions", () => {
        const a = new FixedPrecision("10.625");

        expect(a.toBinary()).toBe("1010.101");
        expect(a.toOctal()).toBe("12.5");
        expect(a.toHex()).toBe("a.a");
        expect(a.toHexadecimal()).toBe("a.a");
      });

      test("base conversion methods keep the sign", () => {
        const a = new FixedPrecision("-15.5");

        expect(a.toBinary()).toBe("-1111.1");
        expect(a.toOctal()).toBe("-17.4");
        expect(a.toHex()).toBe("-f.8");
      });

      test("base conversion methods support significant-digit rounding", () => {
        expect(new FixedPrecision("255").toHex(1)).toBe("100");
        expect(new FixedPrecision("255").toHex(2)).toBe("ff");
        expect(new FixedPrecision("0.1").toBinary(4)).toBe("0.0001101");
      });

      test("base conversion methods validate significant digits", () => {
        const a = new FixedPrecision("10.625");

        expect(() => a.toBinary(0)).toThrow("Invalid precision");
        expect(() => a.toOctal(1.5)).toThrow("Invalid precision");
        expect(() => a.toHex(1e6)).toThrow("Invalid precision");
      });
    });
  });

  describe("Bitwise Operations", () => {
    const FP0 = FixedPrecision.create({ places: 0 });

    test("bitAnd", () => {
      const a = FP0(12);
      const b = FP0(5);
      expect(a.bitAnd(b).toString()).toBe("4");
    });

    test("bitOr", () => {
      const a = FP0(12);
      const b = FP0(5);
      expect(a.bitOr(b).toString()).toBe("13");
    });

    test("bitXor", () => {
      const a = FP0(12);
      const b = FP0(5);
      expect(a.bitXor(b).toString()).toBe("9");
    });

    test("bitNot", () => {
      const a = FP0(12);
      expect(a.bitNot().toString()).toBe("-13");
    });

    test("leftShift", () => {
      const a = FP0(12);
      expect(a.leftShift(2).toString()).toBe("48");
      expect(() => a.leftShift(-1)).toThrow();
    });

    test("rightArithShift", () => {
      const a = FP0(12);
      expect(a.rightArithShift(2).toString()).toBe("3");
      expect(() => a.rightArithShift(-1)).toThrow();
    });
  });

  describe("Combinatorics Operations", () => {
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

  describe("scale() method", () => {
    test("scale() changes context and rounds correctly to 4 decimals", () => {
      const a = new FixedPrecision("123.456789");
      expect(a.scale(4).toString()).toBe("123.4568");
    });
    test("scale() changes context and rounds correctly to 0 decimals", () => {
      const a = new FixedPrecision("99.99999999");
      expect(a.scale(0, 4).toString()).toBe("100");
    });
    test("scale() can increase decimal places", () => {
      const FP2 = FixedPrecision.create({ places: 2 });
      const a = FP2("1.23");
      expect(a.scale(4).toString()).toBe("1.2300");
    });
    test("scale() does not mutate the original value", () => {
      const a = new FixedPrecision("123.456789");
      a.scale(2);
      expect(a.toString()).toBe("123.45678900");
    });
    test("scale() validates the target scale", () => {
      const a = new FixedPrecision("123.456789");
      expect(() => a.scale(-1)).toThrow(
        "newScale must be an integer between 0 and 20",
      );
      expect(() => a.scale(21)).toThrow(
        "newScale must be an integer between 0 and 20",
      );
    });
  });

  describe("Fraction and Leftover Methods", () => {
    test("fraction() returns proper division result", () => {
      const a = new FixedPrecision("10.00000000");
      const b = new FixedPrecision("0.00000002");
      const result = a.fraction(b);
      expect(result.toString()).toBe("5.00000000");
    });
    test("leftover() returns proper remainder", () => {
      const a = new FixedPrecision("10.50000000");
      const b = new FixedPrecision("3.00000000");
      const result = a.leftover(b);
      expect(result.toString()).toBe("1.50000000");
    });
  });

  describe("Fraction Operations", () => {
    test("numerator and denominator", () => {
      const x = new FixedPrecision("12.34"); // Places = 8, SCALE = 10^8
      const num = x.num();
      const den = x.den();

      // 12.34 = 1234 / 100 = 617 / 50
      expect(num.toNumber()).toBe(617);
      expect(den.toNumber()).toBe(50);

      // Verify that num / den reconstructs the original value
      expect(num.div(den).toString()).toBe("12.34000000");
    });

    test("negative numerator", () => {
      const x = new FixedPrecision("-1.5");
      expect(x.num().toNumber()).toBe(-3);
      expect(x.den().toNumber()).toBe(2);
    });

    test("toFraction() returns numerator and denominator", () => {
      const [num, den] = new FixedPrecision("12.34").toFraction();

      expect(num.toNumber()).toBe(617);
      expect(den.toNumber()).toBe(50);
      expect(num.div(den).toString()).toBe("12.34000000");
    });

    test("toFraction(maxDen) limits the denominator", () => {
      const [num, den] = new FixedPrecision("0.33333333").toFraction(100);

      expect(num.toNumber()).toBe(1);
      expect(den.toNumber()).toBe(3);
    });

    test("toFraction(maxDen) validates maxDen", () => {
      expect(() => new FixedPrecision("0.5").toFraction(0)).toThrow(
        "maxDen must be a positive integer",
      );
    });
  });

  describe("Matrix/Vector Operations", () => {
    test("dot product", () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      expect(FixedPrecision.dot(a, b).toNumber()).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    test("cross product", () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      const result = FixedPrecision.cross(a, b);

      expect(result.length).toBe(3);
      expect(result[0]?.toNumber()).toBe(-3);
      expect(result[1]?.toNumber()).toBe(6);
      expect(result[2]?.toNumber()).toBe(-3);
    });

    test("dot product vector length mismatch", () => {
      const a = [1, 2];
      const b = [4, 5, 6];
      expect(() => FixedPrecision.dot(a, b)).toThrow();
    });

    test("cross product vector length mismatch", () => {
      const a = [1, 2];
      const b = [4, 5, 6];
      expect(() => FixedPrecision.cross(a, b)).toThrow();
    });
  });

  describe("Configuration", () => {
    test("configure() sets new decimal places", () => {
      const config: FixedPrecisionConfig = { places: 10 };
      fixedconfig.configure(config);
      const a = new FixedPrecision("1.1234567891");
      expect(a.toString()).toBe("1.1234567891");
    });
    test("configure() throws error for invalid decimal places", () => {
      const config: FixedPrecisionConfig = { places: 25 };
      expect(() => fixedconfig.configure(config)).toThrow(
        "Decimal places must be an integer between 0 and 20",
      );
    });
    test("configure() sets valid rounding mode", () => {
      const config: FixedPrecisionConfig = { places: 8, roundingMode: 2 };
      fixedconfig.configure(config);
      const a = new FixedPrecision("1.00000001");
      expect(a.ceil().toString()).toBe("2.00000000");
    });
    test("configure() throws error for invalid rounding mode", () => {
      const config: FixedPrecisionConfig = {
        places: 8,
        roundingMode: 9 as RoundingMode,
      };
      expect(() => fixedconfig.configure(config)).toThrow(
        "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8",
      );
    });
  });

  // ––– Factory (create) –––
  describe("Factory create()", () => {
    test("factories have independent, fixed precisions", () => {
      const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
      const FP2 = FixedPrecision.create({ places: 2 });

      expect(FP8("1").toString()).toBe("1.00000000");
      expect(FP2("1").toString()).toBe("1.00");
    });

    test("cross-factory arithmetic throws", () => {
      const FP8 = FixedPrecision.create({ places: 8 });
      const FP2 = FixedPrecision.create({ places: 2 });
      expect(() => FP8("1").add(FP2("1"))).toThrow(
        "Cannot operate on different precisions",
      );
    });

    test("factory is immutable and ignores global configure", () => {
      const FP2 = FixedPrecision.create({ places: 2 });
      // Change global default
      fixedconfig.configure({ places: 4 });

      // Factory still uses its own precision
      expect(FP2("1").toString()).toBe("1.00");
      // Global default reflects new config
      expect(new FixedPrecision("1").toString()).toBe("1.0000");
    });

    test("round() uses factory's default rounding mode when rm omitted", () => {
      // ROUND_DOWN (1)
      const FP8_DOWN = FixedPrecision.create({ places: 8, roundingMode: 1 });
      const x = FP8_DOWN("1.23456789");
      expect(x.round(4).toString()).toBe("1.23450000");
      // Default ROUND_HALF_UP (4)
      const FP8_HALFUP = FixedPrecision.create({ places: 8 });
      const y = FP8_HALFUP("1.23456781");
      expect(y.round(4).toString()).toBe("1.23460000");
    });
  });

  // ––– Chaining –––
  describe("Chaining with Raw Numbers", () => {
    // Chaining with raw numbers
    test("chaining with raw numbers", () => {
      const result = new FixedPrecision(10.5).add(5).div(3).toNumber();
      expect(result).toBeCloseTo((10.5 + 5) / 3);
    });
    // Mixed input types
    test("mixed input types in chaining", () => {
      const result = new FixedPrecision(100).add("50").sub(25).mul(2).div("5");
      expect(result.toNumber()).toBeCloseTo(((100 + 50 - 25) * 2) / 5);
    });
    // Comparison with raw numbers
    test("comparison with raw numbers", () => {
      expect(new FixedPrecision(10.5).add(5).gt(15)).toBe(true);
      expect(new FixedPrecision(10).mul(2).eq(20)).toBe(true);
    });
  });
});
