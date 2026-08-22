import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { isNegativeValue } from "../../core/logical/isNegative";

export function isNegative(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return isNegativeValue(toScaled(value, ctx));
}
