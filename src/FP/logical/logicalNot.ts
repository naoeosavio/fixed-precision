import { logicalNotValue } from "../../core/logical/logicalNot";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function logicalNot(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return logicalNotValue(toScaled(value, ctx));
}
