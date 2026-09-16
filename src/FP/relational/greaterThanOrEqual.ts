import { greaterThanOrEqualValue } from "../../core/relational/greaterThanOrEqual";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function greaterThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return greaterThanOrEqualValue(scaled.left, scaled.right);
}

export function greaterThanOrEqualBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): boolean =>
    greaterThanOrEqual(left, right);
}
