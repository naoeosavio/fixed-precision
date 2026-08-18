import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function floor(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.floor(value);
}
