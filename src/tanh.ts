import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { tanh_value } from "./trigonometry/tanh";

export function tanh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, tanh_value);
}
