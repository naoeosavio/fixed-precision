import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function roundToScale(
  value: FixedPrecisionValue,
  places: number,
  rm?: RoundingMode,
): FixedPrecision {
  return new FixedPrecision(value).scale(places, rm);
}
