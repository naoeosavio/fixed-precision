import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { isPositiveValue } from "../../core/logical/isPositive";

export function isPositive(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return isPositiveValue(toScaled(value, ctx));
}
