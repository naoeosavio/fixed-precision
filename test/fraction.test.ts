import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });

describe("Fraction", () => {
  test("num den", () => {
    const x = FP8("12.34");
    expect(x.num().toNumber()).toBe(617);
    expect(x.den().toNumber()).toBe(50);
    expect(x.num().div(x.den()).toString()).toBe("12.34");
  });

  test("negative num den", () => {
    const x = FP8("-1.5");
    expect(x.num().toNumber()).toBe(-3);
    expect(x.den().toNumber()).toBe(2);
  });

  test("fraction", () => {
    const [num, den] = FP8("12.34").fraction();
    expect(num.toNumber()).toBe(617);
    expect(den.toNumber()).toBe(50);
    expect(num.div(den).toString()).toBe("12.34");
  });

  test("fraction with maxDen", () => {
    const [num, den] = FP8("0.33333333").fraction(100);
    expect(num.toNumber()).toBe(1);
    expect(den.toNumber()).toBe(3);
  });

  test("fraction validation", () => {
    expect(() => FP8("0.5").fraction(0)).toThrow(
      "maxDen must be a positive integer",
    );
  });
});
