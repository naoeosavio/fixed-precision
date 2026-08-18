import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function lessThanOrEqual(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return new FixedPrecision(left).lte(right);
}
