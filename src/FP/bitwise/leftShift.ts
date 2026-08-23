import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function leftShift(
  value: FixedPrecisionOperand,
  n: number,
): FixedPrecisionData {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Shift amount must be a non-negative integer");
  }
  return fromContextValue(value, (raw) => raw << BigInt(n));
}
