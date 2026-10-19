import { logicalXorValues } from "../../../core/src/core/logical/logicalXor";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function logicalXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return logicalXorValues(scaled.left, scaled.right);
}

export function logicalXorBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): boolean => logicalXor(left, right);
}
