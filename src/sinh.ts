import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { sinh_value } from "./trigonometry/sinh";

export function sinh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, sinh_value);
}
