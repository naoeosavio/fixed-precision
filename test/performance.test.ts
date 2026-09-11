import { describe, expect, test } from "vitest";

import { cbrt_value } from "../src/core/arithmetic/cbrt";
import { cbrt_initial_guess } from "../src/core/arithmetic/internal/cbrt_initial_guess";
import { root_initial_guess } from "../src/core/arithmetic/internal/root_initial_guess";
import { root_value } from "../src/core/arithmetic/root";
import { count_digits } from "../src/core/utils/countDigits";
import { powerOfTen } from "../src/core/utils/powerOfTen";
import FixedPrecision from "../src/FixedPrecision";
import * as FP from "../src/FP";
import { dataOf } from "../src/FP/construction";
import { stringify } from "../src/FP/string";

// ─── referências (implementações pré-otimização, bit a bit) ────────

function ipow(base: bigint, exp: number): bigint {
  let result = base;
  for (let i = 1; i < exp; i++) result *= base;
  return result;
}

function naive_root(value: bigint, n: number, scale: bigint): bigint {
  const index = BigInt(n);
  const target = value * ipow(scale, n - 1);
  let current = root_initial_guess(target, n);
  let next = (current * (index - 1n) + target / ipow(current, n - 1)) / index;
  while (next < current) {
    current = next;
    next = (current * (index - 1n) + target / ipow(current, n - 1)) / index;
  }
  while (ipow(current, n) > target) current -= 1n;
  while (ipow(current + 1n, n) <= target) current += 1n;
  return current;
}

function naive_cbrt(value: bigint, scale: bigint): bigint {
  const target = value * scale * scale;
  let current = cbrt_initial_guess(target);
  let next = ((current << 1n) + target / (current * current)) / 3n;
  while (next < current) {
    current = next;
    next = ((current << 1n) + target / (current * current)) / 3n;
  }
  while (current * current * current > target) current -= 1n;
  while ((current + 1n) ** 3n <= target) current += 1n;
  return current;
}

function random_bigint(max_bits: number): bigint {
  const bits = 1 + Math.floor(Math.random() * max_bits);
  let out = 1n;
  for (let i = 1; i < bits; i += 30) {
    out = (out << 30n) | BigInt(Math.floor(Math.random() * (1 << 30)));
  }
  return out;
}

// ─── 3.7 count_digits ──────────────────────────────────────────────

describe("count_digits (3.7)", () => {
  test("matches toString().length for random bigints", () => {
    for (let i = 0; i < 500; i++) {
      const v = random_bigint(400);
      expect(count_digits(v)).toBe(v.toString().length);
      expect(count_digits(-v)).toBe(0);
    }
    expect(count_digits(0n)).toBe(0);
  });
});

// ─── 3.6 root/cbrt bit-exact ───────────────────────────────────────

describe("root/cbrt bit-exact vs pre-optimization reference (3.6)", () => {
  test("root n=2..9 random values and scales", () => {
    for (let i = 0; i < 4000; i++) {
      const v = random_bigint(90);
      const scale = powerOfTen(1 + Math.floor(Math.random() * 20));
      for (let n = 2; n <= 9; n++) {
        if (n === 3) continue;
        expect(root_value(v, n, scale)).toBe(naive_root(v, n, scale));
      }
    }
  });

  test("cbrt random values and scales", () => {
    for (let i = 0; i < 4000; i++) {
      const v = random_bigint(90);
      const scale = powerOfTen(1 + Math.floor(Math.random() * 20));
      expect(cbrt_value(v, scale)).toBe(naive_cbrt(v, scale));
      expect(cbrt_value(-v, scale)).toBe(-cbrt_value(v, scale));
    }
  });

  test("negative odd roots", () => {
    for (let n = 3; n <= 9; n += 2) {
      if (n === 3) continue;
      expect(root_value(-1000n, n, 10n)).toBe(-root_value(1000n, n, 10n));
    }
  });

  test("perfect squares/cubes exact", () => {
    for (let i = 1n; i < 200n; i++) {
      expect(root_value(i * i * 10n, 2, 10n)).toBe(i * 10n);
      expect(cbrt_value(i * i * i * 10n, 10n)).toBe(i * 10n);
    }
  });

  test("large values (500 digits)", () => {
    const v = random_bigint(500);
    const scale = powerOfTen(20);
    expect(root_value(v, 2, scale)).toBe(naive_root(v, 2, scale));
    expect(cbrt_value(v, scale)).toBe(naive_cbrt(v, scale));
    expect(root_value(v, 7, scale)).toBe(naive_root(v, 7, scale));
  });
});

// ─── 3.4 class relationals ─────────────────────────────────────────

describe("class relationals preserve mixed-precision throw (3.4)", () => {
  const P2 = FixedPrecision.create({ places: 2, roundingMode: 4 });
  const P8 = FixedPrecision.create({ places: 8, roundingMode: 4 });

  test("throws for different places", () => {
    expect(() => P8("1").eq(P2("1"))).toThrow();
    expect(() => P8("1").gt(P2("1"))).toThrow();
    expect(() => P8("1").gte(P2("1"))).toThrow();
    expect(() => P8("1").lt(P2("1"))).toThrow();
    expect(() => P8("1").lte(P2("1"))).toThrow();
    expect(() => P8("1").cmp(P2("1"))).toThrow();
    expect(() => P8("1").and(P2("1"))).toThrow();
    expect(() => P8("1").or(P2("1"))).toThrow();
    expect(() => P8("1").xor(P2("1"))).toThrow();
  });

  test("same places compare via raw scaled values", () => {
    expect(P8("1.5").eq(P8("1.5"))).toBe(true);
    expect(P8("1.5").gt(P8("1.4"))).toBe(true);
    expect(P8("1.5").lt(P8("1.6"))).toBe(true);
    expect(P8("0").and(P8("1"))).toBe(false);
    expect(P8("1").or(P8("0"))).toBe(true);
    expect(P8("1").xor(P8("1"))).toBe(false);
  });

  test("fromRaw instances behave like normal instances", () => {
    const a = P8("2.5").abs();
    expect(a.places()).toBe(8);
    expect(a.toString()).toBe("2.5");
    expect(a instanceof FixedPrecision).toBe(true);
    expect(a.add(P8("1")).toString()).toBe("3.5");
  });
});

// ─── 3.5 min/max/sum edge cases ────────────────────────────────────

describe("min/max/sum edge cases (3.5)", () => {
  const P8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
  const P2 = FixedPrecision.create({ places: 2, roundingMode: 4 });

  test("ties keep first occurrence", () => {
    const a = P8("5");
    const b = P8("5");
    expect(FixedPrecision.min(a, b)).toBe(a);
    expect(FixedPrecision.max(a, b)).toBe(a);
    const da = dataOf(a);
    const db = dataOf(b);
    expect(FP.min(da, db)).toBe(da);
    expect(FP.max(da, db)).toBe(da);
  });

  test("mixed contexts resolve to highest places", () => {
    expect(FixedPrecision.min(P2("5"), P8("3")).toString()).toBe("3");
    expect(FixedPrecision.max(P2("5"), P8("3")).toString()).toBe("5");
    expect(stringify(FP.min(dataOf(P2("5")), dataOf(P8("3"))))).toBe("3");
    expect(stringify(FP.max(dataOf(P2("5")), dataOf(P8("3"))))).toBe("5");
    expect(stringify(FP.sum(dataOf(P2("1.5")), dataOf(P8("2.25"))))).toBe(
      "3.75",
    );
  });

  test("sum with empty input", () => {
    expect(FixedPrecision.sum([]).toString()).toBe("0");
  });

  test("negative values", () => {
    expect(FixedPrecision.min(P8("-5"), P8("-1"))).toEqual(P8("-5"));
    expect(FixedPrecision.max(P8("-5"), P8("-1"))).toEqual(P8("-1"));
  });
});
