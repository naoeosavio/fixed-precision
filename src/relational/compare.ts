import type { Comparison } from "../FixedPrecision";

export function compareValues(left: bigint, right: bigint): Comparison {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function equalsValue(left: bigint, right: bigint): boolean {
  return left === right;
}

export function notEqualsValue(left: bigint, right: bigint): boolean {
  return left !== right;
}

export function greaterThanValue(left: bigint, right: bigint): boolean {
  return left > right;
}

export function greaterThanOrEqualValue(left: bigint, right: bigint): boolean {
  return left >= right;
}

export function lessThanValue(left: bigint, right: bigint): boolean {
  return left < right;
}

export function lessThanOrEqualValue(left: bigint, right: bigint): boolean {
  return left <= right;
}
