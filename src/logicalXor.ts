import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function logicalXor(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  return FixedPrecision.xor(left, right);
}
