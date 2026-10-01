import type { FixedPrecisionOperand } from "../construction";
import { equals } from "./equals";

export function notEquals(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  return !equals(left, right);
}

export function notEqualsBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): boolean => notEquals(left, right);
}
