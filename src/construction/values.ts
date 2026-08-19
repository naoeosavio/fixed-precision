import type { FixedPrecisionValue } from "../types";

export function collectValues(
  val: FixedPrecisionValue | FixedPrecisionValue[],
  vals: FixedPrecisionValue[],
): FixedPrecisionValue[] {
  return Array.isArray(val) ? [...val, ...vals] : [val, ...vals];
}
