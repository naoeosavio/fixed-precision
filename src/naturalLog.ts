import { natural_log_value } from "./arithmetic/naturalLog";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function naturalLog(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, natural_log_value);
}
