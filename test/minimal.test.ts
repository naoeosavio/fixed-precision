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
