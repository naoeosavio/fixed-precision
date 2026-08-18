import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { acos_value } from "./trigonometry/acos";

export function acos(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, acos_value);
}
