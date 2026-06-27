import { describe, expect, test } from "vitest";

import FixedPrecision, { fixedconfig } from "../src/FixedPrecision.js";

const FP2 = FixedPrecision.create({ places: 2, roundingMode: 4 });
const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP6 = FixedPrecision.create({ places: 6, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP16 = FixedPrecision.create({ places: 16, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

describe("Arithmetic", () => {
  test("add", () => {
    expect(FP8("10.5").add(FP8("3.2")).toString()).toBe("13.70000000");
    expect(FP8("10.5").add(FP8(0)).toString()).toBe("10.50000000");
    expect(FP4("1234.56").add(FP4("765.44")).toString()).toBe("2000.0000");
    expect(() => FP4("-2").add(FP2("1"))).toThrow(
      "Cannot operate on different precisions",
    );
  });

  test("sub", () => {
    expect(FP8("3.2").sub(FP8("10.5")).toString()).toBe("-7.30000000");
    expect(FP8("10.5").sub(FP8(0)).toString()).toBe("10.50000000");
    expect(FP4("3").sub(FP4("9")).toString()).toBe("-6.0000");
  });

  test("mul", () => {
    expect(FP8("10.5").mul(FP8("3.2")).toString()).toBe("33.60000000");
    expect(FP8("10.5").mul(FP8(1)).toString()).toBe("10.50000000");
    expect(FP4("1.2500").mul(FP4("4.0000")).toString()).toBe("5.0000");
    expect(FP4("-2").mul(FP4("-3")).toString()).toBe("6.0000");
  });

  test("div", () => {
    expect(FP8("10.5").div(FP8("3.2")).toFixed(2)).toBe("3.28");
    expect(FP8("10.5").div(FP8("10.5")).toString()).toBe("1.00000000");
    expect(() => FP8("10.5").div(FP8(0))).toThrow("Division by zero");
    expect(FP4("10").div(FP4("3")).toString()).toBe("3.3333");
    expect(() => FP4("10").div(FP4("0"))).toThrow();
  });

  test("mod", () => {
    expect(FP8("10").mod(FP8("3")).toString()).toBe("1.00000000");
    expect(FP8("10").mod(FP8("5")).toString()).toBe("0");
    expect(FP6("10").mod(FP6("3")).toString()).toBe("1.000000");
    expect(FP6("-10").mod(FP6("3")).toString()).toBe("-1.000000");
    expect(FP6("10.5").mod(FP6("3.25")).toString()).toBe("0.750000");
  });

  test("times", () => {
    expect(FP8("100000000").times(FP8("100000000")).toString()).toBe(
      "1000000000000000000000000.00000000",
    );
    expect(FP8("10.5").times(FP8(1)).toString()).toBe(
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

  test("ratio", () => {
    expect(
      FP8("10.00000000").ratio(FP8("0.00000002")).toString(),
    ).toBe("5.00000000");
  });

  test("rem", () => {
    expect(
      FP8("10.50000000").rem(FP8("3.00000000")).toString(),
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
    expect(FP6("3.2").ceil().toString()).toBe("4.000000");
    expect(FP6("-3.2").ceil().toString()).toBe("-3.000000");
  });

  test("floor", () => {
    expect(FP8("1.99999999").floor().toString()).toBe("1.00000000");
    expect(FP8("-1.00000001").floor().toString()).toBe("-2.00000000");
    expect(FP6("3.2").floor().toString()).toBe("3.000000");
    expect(FP6("-3.2").floor().toString()).toBe("-4.000000");
  });

  test("trunc", () => {
    expect(FP8("1.98765432").trunc().toString()).toBe("1.00000000");
    expect(FP8("-1.98765432").trunc().toString()).toBe("-1.00000000");
    expect(FP6("3.7").trunc().toString()).toBe("3.000000");
    expect(FP6("-3.7").trunc().toString()).toBe("-3.000000");
  });

  test("round", () => {
    expect(FP8("1.23456789").round(4).toString()).toBe("1.23460000");
    expect(FP8("1.23456789").round(4, 1).toString()).toBe("1.23450000");
    expect(FP8("1.23455000").round(4, 4).toString()).toBe("1.23460000");
    expect(FP8("-1.23455000").round(4, 4).toString()).toBe("-1.23460000");
    expect(FP8("1.23456789").round(2).toString()).toBe("1.23000000");
    expect(FP6("3.5").round(0).toString()).toBe("4.000000");
    expect(FP6("3.4").round(0).toString()).toBe("3.000000");
    expect(FP6("-3.5").round(0).toString()).toBe("-4.000000");
    expect(FP6("3.141592").round(4).toString()).toBe("3.141600");
    expect(FP6("3.141592").round(2).toString()).toBe("3.140000");
    expect(FP6("3.141592").round(0).toString()).toBe("3.000000");
  });

  test("pow", () => {
    expect(FP8("2.00000000").pow(3).toString()).toBe("8.00000000");
    expect(FP8("2.00000000").pow(-2).toFixed(8)).toBe("0.25000000");
    expect(FP20("2").pow(10).toString()).toBe("1024.00000000000000000000");
    expect(FP20("1.05").pow(24).toString()).toBe("3.22509994371369982542");
    expect(FP20("3").pow(0).toString()).toBe("1.00000000000000000000");
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
    expect(FP20("2").sqrt().toString()).toBe("1.41421356237309504880");
    expect(FP20("9").sqrt().toString()).toBe("3.00000000000000000000");
    expect(FP20("0.5").sqrt().toString()).toBe("0.70710678118654752440");
    expect(() => FP20("-4").sqrt()).toThrow();
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
    expect(FP16("0").exp().toString()).toBe("1.0000000000000000");
    expect(FP16("1").exp().toString()).toBe("2.7182818284590452");
    expect(FP16("2").exp().toString()).toBe("7.3890560989306502");
    expect(FP16("-1").exp().toString()).toBe("0.3678794411714423");
    expect(FP16("10").exp().toString()).toBe("22026.4657948067165190");
  });

  test("ln", () => {
    const r = FP20("2.71828182845904523536").ln();
    expect(r.toNumber()).toBeCloseTo(1, 14);
    expect(r.toString()).toBe("0.99999999999999999999");
    expect(FP20("10").ln().toString()).toBe("2.30258509299404568401");
    expect(FP20("123.456789").ln().toString()).toBe(
      "4.81589120820374401402",
    );
    expect(FP16("1").ln().toString()).toBe("0");
    expect(FP16("2.7182818284590452").ln().toString()).toBe(
      "0.9999999999999999",
    );
    expect(FP16("2").ln().toString()).toBe("0.6931471805599453");
    expect(FP16("10").ln().toString()).toBe("2.3025850929940456");
  });

  test("log", () => {
    expect(FP20("2").log().toNumber()).toBeCloseTo(Math.log(2), 14);
    expect(FP20("2").log().toString()).toBe(FP20("2").ln().toString());
    expect(FP20("16").log(2).toString()).toBe("4.00000000000000000000");
    expect(FP20("81").log(3).toString()).toBe("4.00000000000000000000");
    expect(FP16("8").log2().toString()).toBe("3.0000000000000000");
    expect(FP16("1000").log10().toString()).toBe("3.0000000000000000");
    expect(FP16("27").log(FP16("3")).toString()).toBe("3.0000000000000000");
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
    expect(() => FP16("0").ln()).toThrow();
    expect(() => FP16("-1").ln()).toThrow();
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
