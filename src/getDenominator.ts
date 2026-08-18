import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function getDenominator(value: FixedPrecisionValue): FixedPrecision {
  return new FixedPrecision(value).den();
}
