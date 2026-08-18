import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { sin_value } from "./trigonometry/sin";

export function sin(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, sin_value);
}
