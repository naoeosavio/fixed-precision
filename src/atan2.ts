import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function atan2(
  y: FixedPrecisionValue,
  x: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.atan2(y, x);
}
