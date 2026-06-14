import type { FixedPrecisionValue } from "../FixedPrecision";

export function max_values<T>(
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
    const current = normalize(values[i]);
    if (isGreater(current, result)) result = current;
  }
  return result;
}
