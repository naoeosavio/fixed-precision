import { lessThanValue } from "../../core/relational/lessThan";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function lessThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return lessThanValue(scaled.left, scaled.right);
}
