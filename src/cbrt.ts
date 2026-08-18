import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function cbrt(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.cbrt(value);
}
