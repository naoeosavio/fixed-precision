import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function significantDigits(
  value: FixedPrecisionValue,
  includeZeros = false,
): number {
  return new FixedPrecision(value).precision(includeZeros);
}
