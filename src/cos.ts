import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { cos_value } from "./trigonometry/cos";

export function cos(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, cos_value);
}
