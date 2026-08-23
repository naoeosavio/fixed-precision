import { isZeroValue } from "../../core/logical/isZero";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function isZero(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return isZeroValue(toScaled(value, ctx));
}
