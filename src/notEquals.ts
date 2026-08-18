import { equals } from "./equals";
import type { FixedPrecisionValue } from "./FixedPrecision";

export function notEquals(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return !equals(left, right);
}
