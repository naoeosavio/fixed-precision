import FixedPrecision, {
  fixedconfig,
  FixedPrecisionConfig,
  RoundingMode,
} from '../src/FixedPrecision';

describe("FixedPrecision", () => {
  // ––– Existing Constructor Tests –––
  describe("Constructor", () => {
    test("accepts valid string with 8 decimals", () => {
      const a = new FixedPrecision("12345.67891234");
      expect(a.toString()).toBe("12345.67891234");
    });

    test("rounds string with >8 decimals using Number conversion", () => {
      const a = new FixedPrecision("0.123456789"); // 9 decimals
      expect(a.toString()).toBe("0.12345678");
    });

    test("accepts number input", () => {
      const a = new FixedPrecision(42.12345678);
      expect(a.toString()).toBe("42.12345678");
    });

    test("accepts bigint input", () => {
      const a = new FixedPrecision(123456789n);
      expect(a.toNumber()).toBe(123456789);
    });

    test("throws error for invalid string", () => {
      expect(() => new FixedPrecision("abc")).toThrow(
        "The number NaN cannot be converted to a BigInt because it is not an integer"
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
      expect(result.toString()).toBe(
        "100000000000000000000000000000000.00000000"
      );
    });

    test("product() - product with one", () => {
      const one = new FixedPrecision(1);
      expect(a.product(one).toString()).toBe(a.shiftedBy(16).toString());
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
    test("shiftedBy() shifts left (positive n)", () => {
      const a = new FixedPrecision("1.23456789");
      const shifted = a.shiftedBy(2);
      expect(shifted.toString()).toBe("123.45678900");
    });
    test("shiftedBy() shifts right (negative n) exactly", () => {
      const a = new FixedPrecision("123.45678900");
      const shifted = a.shiftedBy(-2);
      expect(shifted.toString()).toBe("1.23456789");
    });
    test("shiftedBy() throws error on inexact shift", () => {
      const a = new FixedPrecision("123.45678900");
      expect(() => a.shiftedBy(-3)).toThrow("Inexact shift");
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
      expect(parts[1].length).toBe(8);
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

  describe("scale() method", () => {
    test("scale() rounds correctly to 4 decimals", () => {
      const a = new FixedPrecision("123.456789");
      expect(a.scale(4).toString()).toBe("123.45680000");
    });
    test("scale() rounds correctly to 0 decimals", () => {
      const a = new FixedPrecision("99.99999999");
      expect(a.scale(0, 4).toString()).toBe("100.00000000");
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
        "Decimal places must be an integer between 0 and 20"
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
        "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8"
      );
    });
  });
});
