import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { asinh_value } from "./trigonometry/asinh";

export function asinh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, asinh_value);
}
