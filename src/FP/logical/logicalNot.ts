import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { logicalNotValue } from "../../core/logical/logicalNot";

export function logicalNot(value: FixedPrecisionOperand): boolean {
  const ctx = resolveContext([value]);
  return logicalNotValue(toScaled(value, ctx));
}
