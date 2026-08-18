import type { FixedPrecisionValue } from "./FixedPrecision";
import { precision } from "./precision";

export function significantDigits(
  value: FixedPrecisionValue,
  includeZeros = false,
): number {
  return precision(value, includeZeros);
}
