import { isPositiveValue } from "../../../core/src/core/logical/isPositive";
import { type FixedPrecisionOperand, toSingleScaled } from "../construction";

export function isPositive(value: FixedPrecisionOperand): boolean {
  return isPositiveValue(toSingleScaled(value));
}
