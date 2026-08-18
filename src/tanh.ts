import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function tanh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.tanh(value);
}
