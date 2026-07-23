import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision.js";

const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });

describe("Statistics", () => {
  test("min", () => {
    expect(FixedPrecision.min("5.5").toString(false)).toBe("5.50000000");
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
    expect(FixedPrecision.min(FP4("100.5"), "50.25").toString(false)).toBe(
      "50.2500",
    );
  });

  test("max", () => {
    expect(FixedPrecision.max("-3.5").toString(false)).toBe("-3.50000000");
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
    expect(FixedPrecision.sum(FP4("10.50"), "20.25").toString(false)).toBe(
      "30.7500",
    );
    expect(FixedPrecision.sum([]).toNumber()).toBe(0);
  });

  test("hypot", () => {
    expect(FixedPrecision.hypot(3, 4).toString(false)).toBe("5.00000000");
    expect(FixedPrecision.hypot("1", "2", "2").toString(false)).toBe("3.00000000");
    expect(FixedPrecision.hypot([6, 8]).toString(false)).toBe("10.00000000");
    expect(FixedPrecision.hypot().toString()).toBe("0");
    expect(FixedPrecision.hypot(FP4("3"), "4").toString(false)).toBe("5.0000");
  });
});
