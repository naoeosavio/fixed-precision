import { isNegativeValue } from "../../core/logical/isNegative";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function isNegative(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return isNegativeValue(toScaled(value, ctx));
}
