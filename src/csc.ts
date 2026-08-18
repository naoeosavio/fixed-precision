import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { csc_value } from "./trigonometry/csc";

export function csc(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, csc_value);
}
