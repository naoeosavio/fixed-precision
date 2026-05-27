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
