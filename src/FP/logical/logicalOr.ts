import { logicalOrValues } from "../../core/logical/logicalOr";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function logicalOr(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return logicalOrValues(scaled.left, scaled.right);
}

export function logicalOrBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): boolean => logicalOr(left, right);
}
