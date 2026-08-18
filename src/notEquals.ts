import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function notEquals(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return !new FixedPrecision(left).eq(right);
}
