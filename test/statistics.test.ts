import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

const FP4 = FixedPrecision.create({ places: 4, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP16 = FixedPrecision.create({ places: 16, roundingMode: 4 });
const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

describe("Statistics", () => {
  test("min", () => {
    expect(FixedPrecision.min(FP20("5.5")).toString()).toBe("5.5");
    expect(FixedPrecision.min(FP8("10.5"), FP16("3.2")).toNumber()).toBe(3.2);
    expect(
      FixedPrecision.min(FP4("5.0"), "3.0", "7.0", "1.0", "4.0").toNumber(),
    ).toBe(1);
    expect(FixedPrecision.min(FP20("-5.0"), FP8("-10.0"), FP4("3.0")).toNumber()).toBe(-10);
  });

  test("min instances", () => {
    expect(FixedPrecision.min(FP8("100.5"), FP8("50.25")).toNumber()).toBe(
      50.25,
    );
    expect(FixedPrecision.min(FP8("10.0"), FP16("5.5"), FP20("3.0")).toNumber()).toBe(3);
    expect(FixedPrecision.min(FP4("100.5"), FP8("50.25")).toString()).toBe("50.25");
  });

  test("max", () => {
    expect(FixedPrecision.max(FP20("-3.5")).toString()).toBe("-3.5");
    expect(FixedPrecision.max(FP8("10.5"), FP16("3.2")).toNumber()).toBe(10.5);
    expect(
      FixedPrecision.max(FP4("1.0"), "3.0", "7.0", "5.0", "2.0").toNumber(),
    ).toBe(7);
    expect(FixedPrecision.max(FP16("-5.0"), FP8("-10.0"), FP4("-3.0")).toNumber()).toBe(-3);
  });

  test("max instances", () => {
    expect(FixedPrecision.max(FP8("50.25"), FP8("100.5")).toNumber()).toBe(
      100.5,
    );
    expect(FixedPrecision.max(FP8("10.0"), FP16("5.5"), FP20("3.0")).toNumber()).toBe(10);
  });

  test("min/max equal values", () => {
    expect(FixedPrecision.min(FP8("5.0"), FP4("5.0"), FP20("5.0")).toNumber()).toBe(5);
    expect(FixedPrecision.max(FP16("5.0"), FP8("5.0"), FP4("5.0")).toNumber()).toBe(5);
  });

  test("min/max array", () => {
    expect(FixedPrecision.min([FP8("2"), FP4("1"), FP16("4"), FP20("3")]).toNumber()).toBe(1);
    expect(FixedPrecision.max([FP16("2"), FP8("1"), FP20("4"), FP4("3")]).toNumber()).toBe(4);
  });

  test("min/max array plus spread args", () => {
    expect(FixedPrecision.min([FP8("2"), FP4("1")], FP20("0.5")).toString()).toBe("0.5");
    expect(FixedPrecision.max([FP16("2"), FP8("1")], FP20("5")).toString()).toBe("5");
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
    expect(FixedPrecision.sum(FP8("2.5"), FP16("3.5"), FP4("1.0")).toNumber()).toBe(7);
    expect(FixedPrecision.sum(FP20("5.5")).toNumber()).toBe(5.5);
    expect(FixedPrecision.sum([FP8("1"), FP16("2"), FP4("3"), FP20("4")]).toNumber()).toBe(10);
    expect(FixedPrecision.sum(FP16("10.0"), FP8("-3.0"), FP4("-2.0")).toNumber()).toBe(5);
  });

  test("sum instances", () => {
    expect(FixedPrecision.sum(FP8("10.5"), FP16("5.25"), FP20("3.0")).toNumber()).toBe(
      18.75,
    );
    expect(FixedPrecision.sum(FP4("10.50"), FP8("20.25")).toString()).toBe("30.75");
    expect(FixedPrecision.sum([]).toNumber()).toBe(0);
  });

  test("hypot", () => {
    expect(FixedPrecision.hypot(FP8("3"), FP8("4")).toString()).toBe("5");
    expect(FixedPrecision.hypot(FP16("1"), FP8("2"), FP4("2")).toString()).toBe("3");
    expect(FixedPrecision.hypot([FP20("6"), FP8("8")]).toString()).toBe("10");
    expect(FixedPrecision.hypot().toString()).toBe("0");
    expect(FixedPrecision.hypot(FP4("3"), FP8("4")).toString()).toBe("5");
  });
});
