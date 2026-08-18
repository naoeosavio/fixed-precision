import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function mod(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.mod(value, amount);
}
