import { describe, expect, test } from "vitest";

import {
  combinations as fpCombinations,
  factorial as fpFactorial,
  permutations as fpPermutations,
} from "../src/FP/combinatorics";
import { createFactory } from "../src/FP/construction/createFactory";

describe("combinatorics safe integer guard (4.6)", () => {
  const F8 = createFactory({ places: 8, roundingMode: 4 });

  test("factorial throws beyond MAX_SAFE_INTEGER (number input)", () => {
    expect(() => fpFactorial(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      "factorial argument must be a safe integer",
    );
  });

  test("factorial throws beyond MAX_SAFE_INTEGER (FixedPrecision input)", () => {
    expect(() => fpFactorial(F8("99999999999999999"))).toThrow(
      "factorial argument must be a safe integer",
    );
  });

  test("permutations/combinations throw beyond MAX_SAFE_INTEGER", () => {
    expect(() => fpPermutations(Number.MAX_SAFE_INTEGER + 1, 2)).toThrow(
      "permutations argument must be a safe integer",
    );
    expect(() => fpCombinations(Number.MAX_SAFE_INTEGER + 1, 2)).toThrow(
      "combinations argument must be a safe integer",
    );
    expect(() => fpPermutations(5, Number.MAX_SAFE_INTEGER + 1)).toThrow(
      "permutations argument must be a safe integer",
    );
  });

  test("safe inputs still work", () => {
    expect(fpFactorial(5).value).toBe(120n * 100000000n);
    expect(fpPermutations(5, 2).value).toBe(20n * 100000000n);
    expect(fpCombinations(5, 2).value).toBe(10n * 100000000n);
  });
});