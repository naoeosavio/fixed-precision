import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function subtract(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.sub(value, amount);
}
