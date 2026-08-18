import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function multiply(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.mul(value, amount);
}
