import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function divide(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.div(value, amount);
}
