import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function naturalLog(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.ln(value);
}
