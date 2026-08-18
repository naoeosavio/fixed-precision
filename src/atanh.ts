import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { atanh_value } from "./trigonometry/atanh";

export function atanh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, atanh_value);
}
