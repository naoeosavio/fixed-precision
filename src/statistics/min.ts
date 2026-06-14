import type { FixedPrecisionValue } from "../FixedPrecision";

export function min_values<T>(
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
    const current = normalize(values[i]);
    if (isLess(current, result)) result = current;
  }
  return result;
}
