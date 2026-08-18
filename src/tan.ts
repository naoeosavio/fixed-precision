import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { tan_value } from "./trigonometry/tan";

export function tan(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, tan_value);
}
