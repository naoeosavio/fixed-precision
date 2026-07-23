import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

describe("Probability", () => {
  test("random in range", () => {
    const r = FixedPrecision.random().toNumber();
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThan(1);
  });

  test("random decimal places", () => {
    const parts = FixedPrecision.random(8).toString().split(".");
    expect(parts[1]?.length).toBe(8);
  });
});
