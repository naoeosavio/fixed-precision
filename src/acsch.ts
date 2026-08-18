import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { acsch_value } from "./trigonometry/acsch";

export function acsch(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, acsch_value);
}
