import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function equals(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return new FixedPrecision(left).eq(right);
}
