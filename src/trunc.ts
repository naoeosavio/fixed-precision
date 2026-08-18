import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function trunc(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.trunc(value);
}
