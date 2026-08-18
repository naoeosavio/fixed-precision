import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function cross(
  a: FixedPrecisionValue[],
  b: FixedPrecisionValue[],
): FixedPrecision[] {
  return FixedPrecision.cross(a, b);
}
