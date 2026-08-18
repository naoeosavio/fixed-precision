import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function idiv(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): FixedPrecision {
  return new FixedPrecision(value).idiv(other);
}
