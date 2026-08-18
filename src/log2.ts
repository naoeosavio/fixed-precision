import { log2_value } from "./arithmetic/log2";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function log2(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, log2_value);
}
