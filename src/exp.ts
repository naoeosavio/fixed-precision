import { exp_value } from "./arithmetic/exp";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function exp(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, exp_value);
}
