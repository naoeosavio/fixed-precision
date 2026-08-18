import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function round(
  value: FixedPrecisionValue,
  dp?: number,
  rm?: RoundingMode,
): FixedPrecision {
  return FixedPrecision.round(value, dp, rm);
}
