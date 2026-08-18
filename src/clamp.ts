import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function clamp(
  value: FixedPrecisionValue,
  min: FixedPrecisionValue,
  max: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.clamp(value, min, max);
}
