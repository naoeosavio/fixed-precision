import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { sec_value } from "./trigonometry/sec";

export function sec(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, sec_value);
}
