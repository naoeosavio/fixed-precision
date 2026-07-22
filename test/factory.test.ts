import { describe, expect, test } from "vitest";

import FixedPrecision, { fixedconfig } from "../src/FixedPrecision.js";

const FP2 = FixedPrecision.create({ places: 2, roundingMode: 4 });
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP8_DOWN = FixedPrecision.create({ places: 8, roundingMode: 1 });

describe("Factory", () => {
  test("independent precisions", () => {
    expect(FP8("1").toString(false)).toBe("1.00000000");
    expect(FP2("1").toString(false)).toBe("1.00");
  });

  test("cross-factory arithmetic throws", () => {
    expect(() => FP8("1").add(FP2("1"))).toThrow(
      "Cannot operate on different precisions",
    );
  });

  test("ignores global configure", () => {
    fixedconfig.configure({ places: 4 });
    expect(FP2("1").toString(false)).toBe("1.00");
    expect(new FixedPrecision("1").toString(false)).toBe("1.0000");
  });

  test("default rounding mode", () => {
    expect(FP8_DOWN("1.23456789").round(4).toString(false)).toBe("1.23450000");
    expect(FP8("1.23456781").round(4).toString(false)).toBe("1.23460000");
  });
});
