import type FixedPrecision from "./FixedPrecision";
import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import { scale } from "./scale";

export function roundToScale(
  value: FixedPrecisionValue,
  places: number,
  rm?: RoundingMode,
): FixedPrecision {
  return scale(value, places, rm);
}
