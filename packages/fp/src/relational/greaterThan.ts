import { greaterThanValue } from "../../../core/src/core/relational/greaterThan";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function greaterThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return greaterThanValue(scaled.left, scaled.right);
}

export function greaterThanBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): boolean => greaterThan(left, right);
}
