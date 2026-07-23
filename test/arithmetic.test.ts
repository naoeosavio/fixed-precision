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
    expect(FP8("10.5").add("3.2").toString()).toBe("13.7");
    expect(FP8("10.5").add(0).toString()).toBe("10.5");
    expect(FP4("1234.56").add("765.44").toString()).toBe("2000");
    expect(() => FP4("-2").add(FP2("1"))).toThrow(
      "Cannot operate on different precisions",
    );
  });

  test("sub", () => {
    expect(FP8("3.2").sub("10.5").toString()).toBe("-7.3");
    expect(FP8("10.5").sub(0).toString()).toBe("10.5");
    expect(FP4("3").sub("9").toString()).toBe("-6");
  });

  test("mul", () => {
    expect(FP8("10.5").mul("3.2").toString()).toBe("33.6");
    expect(FP8("10.5").mul(1).toString()).toBe("10.5");
    expect(FP4("1.2500").mul("4.0000").toString()).toBe("5");
    expect(FP4("-2").mul("-3").toString()).toBe("6");
  });

  test("div", () => {
    expect(FP8("10.5").div("3.2").toFixed(2)).toBe("3.28");
    expect(FP8("10.5").div("10.5").toString()).toBe("1");
    expect(() => FP8("10.5").div(0)).toThrow("Division by zero");
    expect(FP4("10").div("3").toString()).toBe("3.3333");
    expect(() => FP4("10").div("0")).toThrow();
  });

  test("mod", () => {
    expect(FP8("10").mod("3").toString()).toBe("1");
    expect(FP8("10").mod("5").toString()).toBe("0");
    expect(FP6("10").mod("3").toString()).toBe("1");
    expect(FP6("-10").mod("3").toString()).toBe("-1");
    expect(FP6("10.5").mod("3").toString()).toBe("0");
    expect(FP6("10.5").mod("3.25").toString()).toBe("0.75");
    expect(FP8("12.34").mod("5.67").toString()).toBe("1.72");
  });

  test("times", () => {
    expect(FP8("100000000").times("100000000").toString()).toBe(
      "1000000000000000000000000",
    );
    expect(FP8("10.5").times(1).toString()).toBe(
      "1050000000",
    );
  });

  test("idiv", () => {
    expect(FP8("7.5").idiv(2).toString()).toBe("3");
    expect(FP8("-7.5").idiv(2).toString()).toBe("-3");
    expect(FP8("7.5").dividedToIntegerBy(2).toString()).toBe(
      FP8("7.5").idiv(2).toString(),
    );
  });

  test("ratio", () => {
    expect( FP8("10").ratio("0.00000002").toString(),
    ).toBe("5");
  });

  test("rem", () => {
    expect(FP8("10").rem("3").toString()).toBe("1");
    expect(FP8("10").rem("5").toString()).toBe("0");
    expect(FP6("10").rem("3").toString()).toBe("1");
    expect(FP6("-10").rem("3").toString()).toBe("-1");
    expect(FP6("10.5").rem("3").toString()).toBe("1.5");
    expect(FP6("10.5").rem("3.25").toString()).toBe("0.75");
    expect(FP8("12.34").rem("5.67").toString()).toBe("1");
  });

  test("divmod", () => {
    const r = FP8("10").divmod("3");
    expect(r.quotient.toString()).toBe("3.33333333");
    expect(r.remainder.toString()).toBe("0.00000001");

    const n = FP8("-10").divmod("3");
    expect(n.quotient.toString()).toBe("-3.33333333");
    expect(n.remainder.toString()).toBe("-0.00000001");

    const e = FP8("10").divmod("5");
    expect(e.quotient.toString()).toBe("2");
    expect(e.remainder.toString()).toBe("0");

    expect(() => FP8("10").divmod("0")).toThrow(
      "Division by zero",
    );
    expect(() => FP8("10").divmod(FP4("3"))).toThrow(
      "Cannot operate on different precisions",
    );
  });

  test("rest", () => {
    expect(FP8("12.34").rest("5.67").toString()).toBe("0.00000002");
    expect(FP8("12.34").rest(5.67).toString()).toBe("0.00000002");
    expect(FP8("10").rest("3").toString()).toBe("0.00000001");
    expect(FP8("10").rest("5").toString()).toBe("0");
    expect(() => FP8("10").rest("0")).toThrow("Division by zero");
    expect(() => FP8("10").rest(FP4("3"))).toThrow(
      "Cannot operate on different precisions",
    );
  });

  test("clamp", () => {
    expect(FP8("5").clamp(0, 10).toString()).toBe("5");
    expect(FP8("-1").clamp(0, 10).toString()).toBe("0");
    expect(FP8("11").clamp(0, 10).toString()).toBe("10");
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
    expect(FP8("5.5").toNearest(2).toString()).toBe("6");
    expect(FP8("5").toNearest(2, 1).toString()).toBe("4");
    expect(FP8("-5").toNearest(2).toString()).toBe("-6");
    expect(() => FP8("5").toNearest(0)).toThrow(
      "Increment must be non-zero",
    );
  });

  test("ceil", () => {
    expect(FP8("1.00000001").ceil().toString()).toBe("2");
    expect(FP8("-1.00000001").ceil().toString()).toBe("-1");
    expect(FP6("3.2").ceil().toString()).toBe("4");
    expect(FP6("-3.2").ceil().toString()).toBe("-3");
  });

  test("floor", () => {
    expect(FP8("1.99999999").floor().toString()).toBe("1");
    expect(FP8("-1.00000001").floor().toString()).toBe("-2");
    expect(FP6("3.2").floor().toString()).toBe("3");
    expect(FP6("-3.2").floor().toString()).toBe("-4");
  });

  test("trunc", () => {
    expect(FP8("1.98765432").trunc().toString()).toBe("1");
    expect(FP8("-1.98765432").trunc().toString()).toBe("-1");
    expect(FP6("3.7").trunc().toString()).toBe("3");
    expect(FP6("-3.7").trunc().toString()).toBe("-3");
  });

  test("round", () => {
    expect(FP8("1.23456789").round(4).toString()).toBe("1.2346");
    expect(FP8("1.23456789").round(4, 1).toString()).toBe("1.2345");
    expect(FP8("1.23455").round(4, 4).toString()).toBe("1.2346");
    expect(FP8("-1.23455").round(4, 4).toString()).toBe("-1.2346");
    expect(FP8("1.23456789").round(2).toString()).toBe("1.23");
    expect(FP6("3.5").round(0).toString()).toBe("4");
    expect(FP6("3.4").round(0).toString()).toBe("3");
    expect(FP6("-3.5").round(0).toString()).toBe("-4");
    expect(FP6("3.141592").round(4).toString()).toBe("3.1416");
    expect(FP6("3.141592").round(2).toString()).toBe("3.14");
    expect(FP6("3.141592").round(0).toString()).toBe("3");
  });

  test("pow", () => {
    expect(FP8("2").pow(3).toString()).toBe("8");
    expect(FP8("2").pow(-2).toString()).toBe("0.25");
    expect(FP20("2").pow(10).toString()).toBe("1024");
    expect(FP20("1.05").pow(24).toString()).toBe("3.22509994371369982542");
    expect(FP20("3").pow(0).toString()).toBe("1");
  });

  test("square cube", () => {
    expect(FP8("3.5").square().toString()).toBe("12.25");
    expect(FP8("2.5").cube().toString()).toBe("15.625");
    expect(FixedPrecision.square("3.5").toString()).toBe("12.25");
    expect(FixedPrecision.cube("2.5").toString()).toBe("15.625");
  });

  test("sqrt", () => {
    expect(FP20("9").sqrt().toString()).toBe("3");
    expect(FP20(Math.PI).sqrt().toNumber()).toBeCloseTo(
      Math.sqrt(Math.PI),
      12,
    );
    expect(FP20(0).sqrt().toString()).toBe("0");
    expect(FixedPrecision.sqrt("9").toString()).toBe("3");
    expect(FixedPrecision.sqrt("2").toNumber()).toBeCloseTo(Math.sqrt(2), 7);
    expect(FP20("2").sqrt().toString()).toBe("1.4142135623730950488");
    expect(FP20("9").sqrt().toString()).toBe("3");
    expect(FP20("0.5").sqrt().toString()).toBe("0.7071067811865475244");
    expect(() => FP20("-4").sqrt()).toThrow();
  });

  test("cbrt", () => {
    expect(FP20("27").cbrt().toString()).toBe("3");
    expect(FP20(Math.E).cbrt().toNumber()).toBeCloseTo(
      Math.cbrt(Math.E),
      12,
    );
    expect(FP20("-8").cbrt().toString()).toBe(
      "-2",
    );
    expect(FP20("125").cubeRoot().toString()).toBe(
      FP20("125").cbrt().toString(),
    );
    expect(FixedPrecision.cbrt("64").toString()).toBe("4");
  });

  test("exp", () => {
    expect(FP20("1").exp().toNumber()).toBeCloseTo(Math.E, 14);
    expect(FP20("1").exp().toString()).toBe("2.71828182845904523536");
    expect(FP20("-1").exp().toNumber()).toBeCloseTo(Math.exp(-1), 14);
    expect(FP20("-1").exp().toString()).toBe("0.36787944117144232159");
    expect(FP16("0").exp().toString()).toBe("1");
    expect(FP16("1").exp().toString()).toBe("2.7182818284590452");
    expect(FP16("2").exp().toString()).toBe("7.3890560989306502");
    expect(FP16("-1").exp().toString()).toBe("0.3678794411714423");
    expect(FP16("10").exp().toString()).toBe("22026.465794806716519");
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
    expect(FP20("16").log(2).toString()).toBe("4");
    expect(FP20("81").log(3).toString()).toBe("4");
    expect(FP16("8").log2().toString()).toBe("3");
    expect(FP16("1000").log10().toString()).toBe("3");
    expect(FP16("27").log(FP16("3")).toString()).toBe("3");
  });

  test("log10", () => {
    expect(FP20("100").log10().toNumber()).toBeCloseTo(2, 14);
    expect(FP20("100").log10().toString()).toBe("2");
    expect(FP20("0.01").log10().toString()).toBe("-2");
  });

  test("log2", () => {
    expect(FP20("8").log2().toNumber()).toBeCloseTo(3, 14);
    expect(FP20("8").log2().toString()).toBe("3");
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
    expect(FP2("1.23").scale(4).toString()).toBe("1.23");
    const a = FP8("123.456789");
    a.scale(2);
    expect(a.toString()).toBe("123.456789");
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
    expect(FixedPrecision.abs("-2.5").toString()).toBe("2.5");
    expect(FixedPrecision.add(FP8("1.5"), FP6("2.25")).toString()).toBe("3.75");
    expect(FixedPrecision.sub(FP16("5"), FP6("2.5")).toString()).toBe("2.5");
    expect(FixedPrecision.mul(FP8("2.5"), FP4("4")).toString()).toBe("10");
    expect(FixedPrecision.div(FP20("7.5"), FP8("2.5")).toString()).toBe("3");
    expect(FixedPrecision.mod(FP4("10"), FP20("3")).toString()).toBe("1");
    expect(FixedPrecision.pow(FP16("2"), 3).toString()).toBe("8");
  });

  test("static rounding wrappers", () => {
    expect(FixedPrecision.ceil(FP8("1.1")).toString()).toBe("2");
    expect(FixedPrecision.floor(FP20("1.9")).toString()).toBe("1");
    expect(FixedPrecision.trunc(FP16("1.9")).toString()).toBe("1");
    expect(FixedPrecision.round(FP8("1.2345"), 2).toString()).toBe("1.23");
    expect(FixedPrecision.round(FP20("1.2345"), 0).toString()).toBe("1");
  });

  test("static log wrappers", () => {
    expect(FixedPrecision.ln(FP20("1")).toString()).toBe("0");
    expect(FixedPrecision.log(FP8("8"), FP16("2")).toString()).toBe("3");
    expect(FixedPrecision.log2(FP8("8")).toString()).toBe("3");
    expect(FixedPrecision.log10(FP20("100")).toString()).toBe("2");
  });

  test("static clamp", () => {
    expect(FixedPrecision.clamp(FP4("12"), FP8("0"), FP20("10")).toString()).toBe("10");
  });

  test("static exp", () => {
    fixedconfig.configure({ places: 20, roundingMode: 4 });
    try {
      expect(  FixedPrecision.exp(2).toNumber()).toBeCloseTo(Math.exp(2), 14);
      expect(  FixedPrecision.exp(2).toString()).toBe(
        "7.38905609893065022723",
      );
      expect(  FixedPrecision.exp("2").toString()).toBe(
        FP20("2").exp().toString(),
      );
    } finally {
      fixedconfig.configure({ places: 8, roundingMode: 4 });
    }
  });

  test("chaining", () => {
    expect(FP8(10.5).add(5).div(3).toNumber()).toBeCloseTo((10.5 + 5) / 3);
    expect( FP8(100).add("50").sub(25).mul(2).div("5").toNumber(),
    ).toBeCloseTo(((100 + 50 - 25) * 2) / 5);
    expect(FP8(10.5).add(5).gt(15)).toBe(true);
    expect(FP8(10).mul(2).eq(20)).toBe(true);
  });
});
