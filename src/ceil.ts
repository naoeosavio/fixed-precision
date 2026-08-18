import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function ceil(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.ceil(value);
}
