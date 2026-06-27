import { describe, expect, test } from "vitest";

import FixedPrecision, {
  type FixedPrecisionConfig,
  fixedconfig,
  type RoundingMode,
} from "../src/FixedPrecision.js";

describe("Configuration", () => {
  test("configure places", () => {
    fixedconfig.configure({ places: 10 });
    const a = new FixedPrecision("1.1234567891");
    expect(a.toString()).toBe("1.1234567891");
  });

  test("configure invalid places throws", () => {
    expect(() => fixedconfig.configure({ places: 25 })).toThrow(
      "Decimal places must be an integer between 0 and 20",
    );
  });

  test("configure rounding mode", () => {
    fixedconfig.configure({ places: 8, roundingMode: 2 });
    const a = new FixedPrecision("1.00000001");
    expect(a.ceil().toString()).toBe("2.00000000");
  });

  test("configure invalid rounding mode throws", () => {
    expect(() =>
      fixedconfig.configure({ places: 8, roundingMode: 9 as RoundingMode }),
    ).toThrow("Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8");
  });
});
