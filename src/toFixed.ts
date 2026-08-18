import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function toFixed(
  value: FixedPrecisionValue,
  places = 0,
  rm?: RoundingMode,
): string {
  return new FixedPrecision(value).toFixed(places, rm);
}
