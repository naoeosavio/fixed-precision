import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function shiftedBy(
  value: FixedPrecisionValue,
  n: number,
): FixedPrecision {
  return new FixedPrecision(value).shiftedBy(n);
}
