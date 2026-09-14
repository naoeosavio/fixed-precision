import { lessThanOrEqualValue } from "../../core/relational/lessThanOrEqual";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function lessThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return lessThanOrEqualValue(scaled.left, scaled.right);
}
