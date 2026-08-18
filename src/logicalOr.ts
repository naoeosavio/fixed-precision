import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function logicalOr(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return FixedPrecision.or(left, right);
}
