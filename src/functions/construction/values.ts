import type { FixedPrecisionValue } from "../../FixedPrecision";

export function collectValues(
  val: FixedPrecisionValue | FixedPrecisionValue[],
  vals: FixedPrecisionValue[],
): FixedPrecisionValue[] {
  return Array.isArray(val) ? val : [val, ...vals];
}
