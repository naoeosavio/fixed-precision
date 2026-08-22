import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { isZeroValue } from "../../core/logical/isZero";

export function isZero(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return isZeroValue(toScaled(value, ctx));
}
