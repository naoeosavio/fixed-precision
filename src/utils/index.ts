const BIGINT_POWERS_OF_TEN: bigint[] = [
  1n,
  10n,
  100n,
  1_000n,
  10_000n,
  100_000n,
  1_000_000n,
  10_000_000n,
  100_000_000n,
  1_000_000_000n,
  10_000_000_000n,
  100_000_000_000n,
  1_000_000_000_000n,
  10_000_000_000_000n,
  100_000_000_000_000n,
  1_000_000_000_000_000n,
  10_000_000_000_000_000n,
  100_000_000_000_000_000n,
  1_000_000_000_000_000_000n,
  10_000_000_000_000_000_000n,
  100_000_000_000_000_000_000n,
] as const;

export function powerOfTen(exponent: number): bigint {
  const value = BIGINT_POWERS_OF_TEN[exponent];
  if (value === undefined) {
    throw new Error("Decimal places must be an integer between 0 and 20");
  }
  return value;
}

export function precisionPowerOfTen(exponent: number): bigint {
  return exponent <= 20 ? powerOfTen(exponent) : 10n ** BigInt(exponent);
}

export function cleanTrailingZeros(
  value: bigint,
  radix: number | bigint = 10,
): { n: bigint; c: number } {
  if (value === 0n) return { n: 0n, c: 0 };

  const base = typeof radix === "bigint" ? radix : BigInt(radix);
  const shift = base === 2n ? 1 : base === 8n ? 3 : base === 16n ? 4 : 0;

  let n = value;
  let c = 0;

  if (shift > 0) {
    const s = BigInt(shift);
    while (true) {
      const q = n >> s;
      if (n !== q << s) break;
      n = q;
      c++;
    }
  } else {
    while (true) {
      const q = n / base;
      if (n !== q * base) break;
      n = q;
      c++;
    }
  }

  return { n, c };
}

export function count_digits(value: bigint): number {
  if (value === 0n) return 0;
  let count = 0;
  while (value > 0n) {
    value = value / 10n;
    count++;
  }
  return count;
}
