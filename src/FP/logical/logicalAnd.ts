import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { logicalAndValues } from "../../core/logical/logicalAnd";

export function logicalAnd(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalAndValues(toScaled(left, ctx), toScaled(right, ctx));
}
