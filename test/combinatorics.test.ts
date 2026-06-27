import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";

import { factorial_value } from "../src/combinatorics/factorial";
import { permutations_value } from "../src/combinatorics/permutations";
import { combinations_value } from "../src/combinatorics/combinations";

describe("Combinatorics", () => {
  describe("factorial_value", () => {
    test("0! = 1", () => expect(factorial_value(0)).toBe(1n));
    test("1! = 1", () => expect(factorial_value(1)).toBe(1n));
    test("5! = 120", () => expect(factorial_value(5)).toBe(120n));
    test("10! = 3628800", () => expect(factorial_value(10)).toBe(3628800n));
    test("20! = 2432902008176640000", () =>
      expect(factorial_value(20)).toBe(2432902008176640000n));
    test("throws on negative", () =>
      expect(() => factorial_value(-1)).toThrow());
    test("throws on non-integer", () =>
      expect(() => factorial_value(1.5)).toThrow());
  });

  describe("permutations_value", () => {
    test("P(5,2) = 20", () => expect(permutations_value(5, 2)).toBe(20n));
    test("P(5,5) = 120", () => expect(permutations_value(5, 5)).toBe(120n));
    test("P(5,0) = 1", () => expect(permutations_value(5, 0)).toBe(1n));
    test("P(0,0) = 1", () => expect(permutations_value(0, 0)).toBe(1n));
    test("P(3,5) = 0 (k > n)", () =>
      expect(permutations_value(3, 5)).toBe(0n));
    test("P(10,4) = 5040", () =>
      expect(permutations_value(10, 4)).toBe(5040n));
    test("throws on negative n", () =>
      expect(() => permutations_value(-1, 2)).toThrow());
    test("throws on negative k", () =>
      expect(() => permutations_value(5, -1)).toThrow());
    test("throws on non-integer n", () =>
      expect(() => permutations_value(5.5, 2)).toThrow());
    test("throws on non-integer k", () =>
      expect(() => permutations_value(5, 1.5)).toThrow());
  });

  describe("combinations_value", () => {
    test("C(5,2) = 10", () => expect(combinations_value(5, 2)).toBe(10n));
    test("C(5,3) = 10 (symmetry)", () =>
      expect(combinations_value(5, 3)).toBe(10n));
    test("C(5,0) = 1", () => expect(combinations_value(5, 0)).toBe(1n));
    test("C(5,5) = 1", () => expect(combinations_value(5, 5)).toBe(1n));
    test("C(6,3) = 20", () => expect(combinations_value(6, 3)).toBe(20n));
    test("C(10,4) = 210", () => expect(combinations_value(10, 4)).toBe(210n));
    test("C(5,6) = 0 (k > n)", () =>
      expect(combinations_value(5, 6)).toBe(0n));
    test("C(52,5) = 2598960", () =>
      expect(combinations_value(52, 5)).toBe(2598960n));
    test("throws on negative n", () =>
      expect(() => combinations_value(-1, 2)).toThrow());
    test("throws on negative k", () =>
      expect(() => combinations_value(5, -1)).toThrow());
  });

  describe("FixedPrecision wrappers", () => {
    test("factorial", () => {
      expect(FixedPrecision.factorial(5).toNumber()).toBe(120);
      expect(FixedPrecision.factorial(0).toNumber()).toBe(1);
      expect(() => FixedPrecision.factorial(-1)).toThrow();
    });

    test("permutations", () => {
      expect(FixedPrecision.permutations(5, 2).toNumber()).toBe(20);
      expect(FixedPrecision.permutations(5, 5).toNumber()).toBe(120);
      expect(FixedPrecision.permutations(5, 6).toNumber()).toBe(0);
      expect(() => FixedPrecision.permutations(-1, 2)).toThrow();
    });

    test("combinations", () => {
      expect(FixedPrecision.combinations(5, 2).toNumber()).toBe(10);
      expect(FixedPrecision.combinations(5, 3).toNumber()).toBe(10);
      expect(FixedPrecision.combinations(5, 5).toNumber()).toBe(1);
      expect(FixedPrecision.combinations(5, 6).toNumber()).toBe(0);
      expect(() => FixedPrecision.combinations(-1, 2)).toThrow();
    });
  });
});
