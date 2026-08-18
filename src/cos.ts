import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function cos(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.cos(value);
}
