import { equals } from "./equals";
import type { FixedPrecisionValue } from "./types";

export function notEquals(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return !equals(left, right);
}
