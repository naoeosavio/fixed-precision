import { compareValues } from "../../../core/src/core/relational/compare";
import {
  type Comparison,
  type FixedPrecisionOperand,
  toScaledPair,
} from "../construction";

export function compare(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): Comparison {
  const scaled = toScaledPair(value, other);
  return compareValues(scaled.left, scaled.right);
}

export function compareBy(other: FixedPrecisionOperand) {
  return (value: FixedPrecisionOperand): Comparison => compare(value, other);
}
