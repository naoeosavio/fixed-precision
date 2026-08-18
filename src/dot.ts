import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function dot(
  a: FixedPrecisionValue[],
  b: FixedPrecisionValue[],
): FixedPrecision {
  return FixedPrecision.dot(a, b);
}
