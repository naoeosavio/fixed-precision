import type { FixedPrecisionValue } from "../FixedPrecision";

export function selectMin<T>(
  values: FixedPrecisionValue[],
  normalize: (value: FixedPrecisionValue) => T,
  isLess: (left: T, right: T) => boolean,
): T {
  const first = values[0];
  if (first === undefined) {
    throw new Error("FixedPrecision.min requires at least one argument");
  }
  let result = normalize(first);
  for (let i = 1; i < values.length; i++) {
    const current = normalize(values[i]!);
    if (isLess(current, result)) result = current;
  }
  return result;
}

export function selectMax<T>(
  values: FixedPrecisionValue[],
  normalize: (value: FixedPrecisionValue) => T,
  isGreater: (left: T, right: T) => boolean,
): T {
  const first = values[0];
  if (first === undefined) {
    throw new Error("FixedPrecision.max requires at least one argument");
  }
  let result = normalize(first);
  for (let i = 1; i < values.length; i++) {
    const current = normalize(values[i]!);
    if (isGreater(current, result)) result = current;
  }
  return result;
}

export function sumRawValues(
  values: FixedPrecisionValue[],
  initial: bigint,
  toRaw: (value: FixedPrecisionValue) => bigint,
): bigint {
  let total = initial;
  for (const value of values) {
    total += toRaw(value);
  }
  return total;
}
