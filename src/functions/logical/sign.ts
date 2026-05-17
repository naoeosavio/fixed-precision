export function isZeroValue(value: bigint): boolean {
  return value === 0n;
}

export function isPositiveValue(value: bigint): boolean {
  return value > 0n;
}

export function isNegativeValue(value: bigint): boolean {
  return value < 0n;
}
