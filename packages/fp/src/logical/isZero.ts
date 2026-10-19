import { isZeroValue } from "../../../core/src/core/logical/isZero";
import { type FixedPrecisionOperand, toSingleScaled } from "../construction";

export function isZero(value: FixedPrecisionOperand): boolean {
  return isZeroValue(toSingleScaled(value));
}
