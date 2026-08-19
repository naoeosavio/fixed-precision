import { precision } from "./precision";
import type { FixedPrecisionValue } from "./types";

export function significantDigits(
  value: FixedPrecisionValue,
  includeZeros = false,
): number {
  return precision(value, includeZeros);
}
