import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { asec_value } from "./trigonometry/asec";

export function asec(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, asec_value);
}
