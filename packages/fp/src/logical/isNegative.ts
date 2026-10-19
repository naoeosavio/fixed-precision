import { isNegativeValue } from "../../../core/src/core/logical/isNegative";
import { type FixedPrecisionOperand, toSingleScaled } from "../construction";

export function isNegative(value: FixedPrecisionOperand): boolean {
  return isNegativeValue(toSingleScaled(value));
}
