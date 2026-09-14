import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";
import Minimal from "../src/Minimal";
import {
  DEFAULT_ROUNDING_MODE,
  MAX_PLACES,
  preferContext,
  type FPContext,
} from "../src/core/construction";
import { dataOf } from "../src/FP/construction/dataOf";
import { createFactory } from "../src/FP/construction/createFactory";
import { max as fpMax, min as fpMin, sum as fpSum } from "../src/FP/statistics";

describe("context constants", () => {
  test("MAX_PLACES and DEFAULT_ROUNDING_MODE are exposed", () => {
    expect(MAX_PLACES).toBe(20);
    expect(DEFAULT_ROUNDING_MODE).toBe(4);
  });

  test("class create without roundingMode uses DEFAULT_ROUNDING_MODE", () => {
    const factory = FixedPrecision.create({ places: 4 });
    expect(factory("1").context().roundingMode).toBe(DEFAULT_ROUNDING_MODE);
  });

  test("functional factory without roundingMode uses DEFAULT_ROUNDING_MODE", () => {
    const factory = createFactory({ places: 4 });
    expect(dataOf(factory("1")).ctx.roundingMode).toBe(DEFAULT_ROUNDING_MODE);
  });

  test("Minimal create without roundingMode uses DEFAULT_ROUNDING_MODE", () => {
    const factory = Minimal.create({ places: 4 });
    expect(factory("1").toFixed(4, DEFAULT_ROUNDING_MODE)).toBe("1.0000");
  });
});

describe("resolveContext tie-break: greater places wins", () => {
  const FP4 = FixedPrecision.create({ places: 4, roundingMode: 0 });
  const FP6 = FixedPrecision.create({ places: 6, roundingMode: 0 });

  test("class min/max pick the context with more places", () => {
    expect(FixedPrecision.max(FP4("1"), FP6("2")).context().places).toBe(6);
    expect(FixedPrecision.max(FP6("1"), FP4("2")).context().places).toBe(6);
  });

  test("Minimal min/max/sum pick the context with more places", () => {
    const M4 = Minimal.create({ places: 4 });
    const M6 = Minimal.create({ places: 6 });
    expect(Minimal.max(M6("1"), M4("2")).toFixed(6, 0)).toBe("2.000000");
    expect(Minimal.sum(M4("1"), M6("2")).toFixed(6, 0)).toBe("3.000000");
  });

  test("functional max/min pick the context with more places", () => {
    const fp6 = dataOf(FP6("2"));
    const fp4 = dataOf(FP4("1"));
    expect(dataOf(fpMax(fp4, fp6)).ctx.places).toBe(6);
    expect(dataOf(fpMin(fp6, fp4)).ctx.places).toBe(6);
  });
});

describe("resolveContext tie-break: equal places picks smaller roundingMode", () => {
  const FP4rm0 = FixedPrecision.create({ places: 4, roundingMode: 0 });
  const FP4rm8 = FixedPrecision.create({ places: 4, roundingMode: 8 });

  test("class min/max pick the smaller roundingMode", () => {
    expect(FixedPrecision.max(FP4rm0("1"), FP4rm8("2")).context().roundingMode).toBe(0);
    expect(FixedPrecision.max(FP4rm8("1"), FP4rm0("2")).context().roundingMode).toBe(0);
  });

  test("class sum picks the smaller roundingMode", () => {
    const summed = FixedPrecision.sum(FP4rm8("1"), FP4rm0("2"));
    expect(summed.context().roundingMode).toBe(0);
  });

  test("Minimal sum picks the smaller roundingMode", () => {
    const M4rm0 = Minimal.create({ places: 4, roundingMode: 0 });
    const M4rm8 = Minimal.create({ places: 4, roundingMode: 8 });
    const total = Minimal.sum(M4rm8("1"), M4rm0("2"));
    expect(total.toFixed(4, 0)).toBe("3.0000");
  });

  test("functional sum picks the smaller roundingMode", () => {
    const a = dataOf(FP4rm8("1"));
    const b = dataOf(FP4rm0("2"));
    expect(dataOf(fpSum(a, b)).ctx.roundingMode).toBe(0);
  });
});

describe("preferContext", () => {
  const small: FPContext = {
    places: 2,
    roundingMode: 8,
    SCALE: 100n,
    SCALENUMBER: 100,
  };
  const large: FPContext = {
    places: 6,
    roundingMode: 0,
    SCALE: 10n ** 6n,
    SCALENUMBER: 1e6,
  };

  test("greater places wins regardless of roundingMode", () => {
    expect(preferContext(small, large)).toBe(large);
    expect(preferContext(large, small)).toBe(large);
  });

  test("equal places picks smaller roundingMode, full tie keeps best", () => {
    const rm0: FPContext = {
      places: 4,
      roundingMode: 0,
      SCALE: 10n ** 4n,
      SCALENUMBER: 1e4,
    };
    const rm8: FPContext = {
      places: 4,
      roundingMode: 8,
      SCALE: 10n ** 4n,
      SCALENUMBER: 1e4,
    };
    expect(preferContext(rm8, rm0)).toBe(rm0);
    expect(preferContext(rm0, rm8)).toBe(rm0);
    expect(preferContext(rm0, rm0)).toBe(rm0);
    expect(preferContext(null, rm8)).toBe(rm8);
  });
});
