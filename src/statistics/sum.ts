import type { FixedPrecisionValue } from "../FixedPrecision";

export function sum_values(
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
