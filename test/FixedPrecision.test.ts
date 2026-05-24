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
    });
  });

  describe("shiftedBy() method", () => {
    test("shiftedBy() shifts raw bigint right with positive n", () => {
      const shifted = new FixedPrecision(1000n).shiftedBy(1);
      expect(shifted.raw()).toBe(500n);
    });
    test("shiftedBy() shifts raw bigint left with negative n", () => {
      const shifted = new FixedPrecision(1000n).shiftedBy(-1);
      expect(shifted.raw()).toBe(2000n);
    });
    test("shiftedBy() throws error on non-integer shift", () => {
      const a = new FixedPrecision(1000n);
      expect(() => a.shiftedBy(1.5)).toThrow("shift must be an integer");
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
