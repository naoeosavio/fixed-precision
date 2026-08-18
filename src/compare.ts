import type { Comparison, FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function compare(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): Comparison {
  return new FixedPrecision(value).cmp(other);
}
