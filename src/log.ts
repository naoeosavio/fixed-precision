import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function log(
  value: FixedPrecisionValue,
  base?: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.log(value, base);
}
