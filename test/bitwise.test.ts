import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision.js";

const FP = FixedPrecision.create({ places: 0 });

describe("Bitwise", () => {
  test("bitAnd", () => {
    expect(FP(12).bitAnd(5).toString()).toBe("4");
  });

  test("bitOr", () => {
    expect(FP(12).bitOr(5).toString()).toBe("13");
  });

  test("bitXor", () => {
    expect(FP(12).bitXor(5).toString()).toBe("9");
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
