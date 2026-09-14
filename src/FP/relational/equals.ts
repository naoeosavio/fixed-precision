import { equalsValue } from "../../core/relational/equals";
import { type FixedPrecisionOperand, toScaledPair } from "../construction";

export function equals(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPair(left, right);
  return equalsValue(scaled.left, scaled.right);
}
