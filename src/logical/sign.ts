export function isZeroValue(value: bigint): boolean {
  return value === 0n;
}

export function isPositiveValue(value: bigint): boolean {
  return value > 0n;
}

export function isNegativeValue(value: bigint): boolean {
  return value < 0n;
}

export function logicalNotValue(value: bigint): boolean {
  return value === 0n;
}

export function logicalAndValues(left: bigint, right: bigint): boolean {
  return left !== 0n && right !== 0n;
}

export function logicalOrValues(left: bigint, right: bigint): boolean {
  return left !== 0n || right !== 0n;
}

export function logicalXorValues(left: bigint, right: bigint): boolean {
  return (left !== 0n) !== (right !== 0n);
}
