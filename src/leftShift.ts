import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function leftShift(
  value: FixedPrecisionValue,
  n: number,
): FixedPrecision {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Shift amount must be a non-negative integer");
  }
  // biome-ignore lint/suspicious/noBitwiseOperators: operação bitwise intencional
  return FixedPrecision.fromContextValue(value, (raw) => raw << BigInt(n));
}
