import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function toExponential(
  value: FixedPrecisionValue,
  dp?: number,
  rm?: RoundingMode,
): string {
  return new FixedPrecision(value).toExponential(dp, rm);
}
