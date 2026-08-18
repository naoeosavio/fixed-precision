import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function add(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecision {
  return FixedPrecision.add(value, amount);
}
