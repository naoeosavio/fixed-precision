import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { acot_value } from "./trigonometry/acot";

export function acot(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, acot_value);
}
