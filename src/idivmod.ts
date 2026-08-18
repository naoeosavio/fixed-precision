import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function idivmod(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): { quotient: FixedPrecision; remainder: FixedPrecision } {
  return new FixedPrecision(value).idivmod(other);
}
