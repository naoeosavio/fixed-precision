import { describe, expect, test } from "vitest";

import Minimal from "../src/Minimal";

describe("Minimal cross-precision conversion", () => {
  const M8 = Minimal.create({ places: 8, roundingMode: 4 });
  const M2 = Minimal.create({ places: 2, roundingMode: 4 });

  test("plus rescales a higher-precision operand to the target scale", () => {
    const p2 = M8("1.11").scale(2);
    const p8 = M8("1.11");
    expect(p2.plus(p8).toString()).toBe("2.22");
  });

  test("constructor accepts a higher-precision instance and rescales", () => {
    const p8 = M8("1.11");
    expect(M2(p8).toString()).toBe("1.11");
    expect(M2(p8).plus(M2("1.11")).toString()).toBe("2.22");
  });

  test("minus rescales a higher-precision operand", () => {
    const p2 = M8("5").scale(2);
    expect(p2.minus(M8("0.25")).toString()).toBe("4.75");
  });
});

describe("Minimal mod", () => {
  const M8 = Minimal.create({ places: 8, roundingMode: 4 });

  test("mod the remainder already scaled", () => {
    expect(M8("1.5").mod("0.4").toString()).toBe("0");
    expect(M8("10.5").mod("3").toString()).toBe("0");
    expect(M8("12.34").mod("5.67").toString()).toBe("1.72");
  });
});

describe("Minimal scale carries the requested roundingMode (4.5)", () => {
  const M8 = Minimal.create({ places: 8, roundingMode: 4 });

  test("scale keeps values exact regardless of rm", () => {
    const p2 = M8("1.115").scale(2, 1);
    expect(p2.toString()).toBe("1.11");
    expect(p2.toFixed(2, 1)).toBe("1.11");
  });

  test("operations after scale respect the rm passed to scale", () => {
    const p2 = M8("2.345").scale(2, 1);
    expect(p2.toString()).toBe("2.34");
    expect(p2.plus(p2).toString()).toBe("4.68");
    expect(Minimal.max(p2, M8("1.11")).toString()).toBe("2.34");
    expect(Minimal.min(p2, M8("1.11")).toString()).toBe("1.11");
    expect(Minimal.sum(p2, M8("1.11")).toString()).toBe("3.45");
  });

  test("scale without rm keeps the source roundingMode", () => {
    const p2 = M8("2.345").scale(2);
    expect(p2.toFixed(2, 4)).toBe("2.35");
    expect(p2.plus(p2).toString()).toBe("4.7");
  });

  test("scale with a different rm does not contaminate the default context", () => {
    const defaultScaled = M8("1.005").scale(2, 1);
    expect(defaultScaled.toString()).toBe("1");
    const fresh = M8("1.5").scale(2);
    expect(fresh.plus(fresh).toString()).toBe("3");
  });
});
