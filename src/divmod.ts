import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function divmod(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): { quotient: FixedPrecision; remainder: FixedPrecision } {
  return new FixedPrecision(value).divmod(other);
}
