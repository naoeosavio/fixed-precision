import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { cot_value } from "./trigonometry/cot";

export function cot(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, cot_value);
}
