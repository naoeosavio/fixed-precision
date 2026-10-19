import { logicalAndValues } from "../../../core/src/core/logical/logicalAnd";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function logicalAnd(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return logicalAndValues(scaled.left, scaled.right);
}

export function logicalAndBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): boolean => logicalAnd(left, right);
}
