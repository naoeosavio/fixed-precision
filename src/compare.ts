import type { Comparison, FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { compareValues } from "./relational/compare";

export function compare(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): Comparison {
  const ctx = FixedPrecision.resolveContext([value, other]);
  return compareValues(
    FixedPrecision.toScaled(value, ctx),
    FixedPrecision.toScaled(other, ctx),
  );
}
