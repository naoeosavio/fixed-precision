import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function lessThan(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return new FixedPrecision(left).lt(right);
}
