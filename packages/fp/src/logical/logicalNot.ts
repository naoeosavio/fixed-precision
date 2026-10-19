import { logicalNotValue } from "../../../core/src/core/logical/logicalNot";
import { type FixedPrecisionOperand, toSingleScaled } from "../construction";

export function logicalNot(value: FixedPrecisionOperand): boolean {
  return logicalNotValue(toSingleScaled(value));
}
