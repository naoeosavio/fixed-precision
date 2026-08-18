import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { cosh_value } from "./trigonometry/cosh";

export function cosh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, cosh_value);
}
