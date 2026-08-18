import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { csch_value } from "./trigonometry/csch";

export function csch(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, csch_value);
}
