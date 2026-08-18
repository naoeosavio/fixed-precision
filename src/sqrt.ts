import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function sqrt(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.sqrt(value);
}
