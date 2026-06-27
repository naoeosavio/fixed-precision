import { describe, expect, test } from "vitest";

import FixedPrecision, { fixedconfig } from "../src/FixedPrecision.js";

const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP16 = FixedPrecision.create({ places: 16, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

const PI = "3.14159265358979323846";
const HALF_PI = "1.57079632679489661923";

describe("Trigonometry", () => {
  test("sin cos tan zero", () => {
    expect(FP20("0").sin().toString()).toBe("0");
    expect(FP20("0").cos().toString()).toBe("1.00000000000000000000");
    expect(FP20("0").tan().toString()).toBe("0");
    expect(FP16("0").sin().toString()).toBe("0");
    expect(FP16("0").cos().toString()).toBe("1.0000000000000000");
    expect(FP16("0").tan().toString()).toBe("0");
  });

  test("sin cos common angles", () => {
    expect(FP20(HALF_PI).sin().toNumber()).toBeCloseTo(1, 14);
    expect(FP20(PI).sin().toNumber()).toBeCloseTo(0, 14);
    expect(FP20(PI).cos().toNumber()).toBeCloseTo(-1, 14);
    expect(FP16("1.5707963267948966").sin().toString()).toBe(
      "1.0000000000000000",
    );
    expect(FP16("3.1415926535897932").sin().toString()).toBe("0");
    expect(FP16("3.1415926535897932").cos().toString()).toBe(
      "-1.0000000000000000",
    );
  });

  test("sin cos tan non-trivial", () => {
    for (const v of ["0.5", "0.75", "3.25"]) {
      const f = FP20(v);
      const n = Number(v);
      expect(f.sin().toNumber()).toBeCloseTo(Math.sin(n), 12);
      expect(f.cos().toNumber()).toBeCloseTo(Math.cos(n), 12);
      expect(f.tan().toNumber()).toBeCloseTo(Math.tan(n), 12);
    }
    expect(FP16("0.5235987755982988").sin().toString()).toBe(
      "0.4999999999999999",
    );
    expect(FP16("1.0471975511965977").cos().toString()).toBe(
      "0.5000000000000000",
    );
    expect(FP16("0.7853981633974483").tan().toString()).toBe(
      "0.9999999999999999",
    );
    expect(FP16("1.0471975511965977").tan().toString()).toBe(
      "1.7320508075688771",
    );
  });

  test("negative radians", () => {
    const f = FP8("-0.75");
    expect(f.sin().toNumber()).toBeCloseTo(Math.sin(-0.75), 7);
    expect(f.cos().toNumber()).toBeCloseTo(Math.cos(-0.75), 7);
    expect(f.tan().toNumber()).toBeCloseTo(Math.tan(-0.75), 7);
    expect(FP16("-0.5235987755982988").sin().toString()).toBe(
      "0.4999999999999999",
    );
    expect(FP16("6.2831853071795864").sin().toString()).toBe("0");
  });

  test("tan pi/2", () => {
    expect(FP16("1.5707963267948966").tan().toString()).toBe(
      "51998505354962076.9700596246061503",
    );
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

  test("atan exact", () => {
    expect(FP16("0").atan().toString()).toBe("0");
    expect(FP16("1").atan().toString()).toBe("0.7853981633974483");
    expect(FP16("-1").atan().toString()).toBe("-0.7853981633974483");
    expect(FP16("1.7320508075688772").atan().toString()).toBe(
      "1.0471975511965977",
    );
    expect(FP16("0.5773502691896257").atan().toString()).toBe(
      "0.5235987755982988",
    );
    expect(FP16("10").atan().toString()).toBe("1.4711276743037345");
  });

  test("atan2 exact", () => {
    expect(FP16("1").atan2(FP16("1")).toString()).toBe(
      "0.7853981633974483",
    );
    expect(FP16("1").atan2(FP16("-1")).toString()).toBe(
      "2.3561944901923449",
    );
  });

  test("asin exact", () => {
    expect(FP16("0").asin().toString()).toBe("0");
    expect(FP16("1").asin().toString()).toBe("1.5707963267948966");
    expect(FP16("-1").asin().toString()).toBe("-1.5707963267948966");
    expect(FP16("0.5").asin().toString()).toBe("0.5235987755982988");
    expect(FP16("-0.5").asin().toString()).toBe("0.5235987755982988");
  });

  test("acos exact", () => {
    expect(FP16("1").acos().toString()).toBe("0");
    expect(FP16("-1").acos().toString()).toBe("3.1415926535897932");
    expect(FP16("0").acos().toString()).toBe("1.5707963267948966");
    expect(FP16("0.5").acos().toString()).toBe("1.0471975511965977");
  });

  test("trig identities", () => {
    expect(
      FP16("0.70710678118654752440084436210484").asin().sin().toString(),
    ).toBe("0.7071067811865474");
    expect(
      FP16("0.70710678118654752440084436210484").acos().cos().toString(),
    ).toBe("0.7071067811865475");
  });

  test("inverse domain validation", () => {
    expect(() => FP16("1.5").asin()).toThrow();
    expect(() => FP16("1.5").acos()).toThrow();
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
