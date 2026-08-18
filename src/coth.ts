import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { coth_value } from "./trigonometry/coth";

export function coth(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, coth_value);
}
