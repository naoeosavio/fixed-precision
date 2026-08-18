import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { atan_value } from "./trigonometry/atan";

export function atan(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, atan_value);
}
