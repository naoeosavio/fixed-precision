import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { sech_value } from "./trigonometry/sech";

export function sech(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, sech_value);
}
