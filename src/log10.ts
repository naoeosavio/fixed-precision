import { log10_value } from "./arithmetic/log10";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function log10(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, log10_value);
}
