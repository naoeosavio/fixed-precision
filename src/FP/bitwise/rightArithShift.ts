import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function rightArithShift(
  value: FixedPrecisionOperand,
  n: number,
): FixedPrecisionData {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Shift amount must be a non-negative integer");
  }
  return fromContextValue(value, (raw) => raw >> BigInt(n));
}
