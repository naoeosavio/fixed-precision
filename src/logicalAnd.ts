import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function logicalAnd(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return FixedPrecision.and(left, right);
}
