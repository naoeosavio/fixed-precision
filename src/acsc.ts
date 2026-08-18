import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { acsc_value } from "./trigonometry/acsc";

export function acsc(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, acsc_value);
}
