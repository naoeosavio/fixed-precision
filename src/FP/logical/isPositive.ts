import { isPositiveValue } from "../../core/logical/isPositive";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function isPositive(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return isPositiveValue(toScaled(value, ctx));
}
