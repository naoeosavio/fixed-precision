import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function rightArithShift(
  value: FixedPrecisionValue,
  n: number,
): FixedPrecisionLike {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Shift amount must be a non-negative integer");
  }
  // biome-ignore lint/suspicious/noBitwiseOperators: operação bitwise intencional
  return fromContextValue(value, (raw) => raw >> BigInt(n));
}

registerFunction("rightArithShift", rightArithShift);
