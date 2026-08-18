import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { asin_value } from "./trigonometry/asin";

export function asin(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, asin_value);
}
