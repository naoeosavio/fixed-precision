import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function greaterThanOrEqual(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return new FixedPrecision(left).gte(right);
}
