import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { logicalOrValues } from "../../core/logical/logicalOr";

export function logicalOr(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalOrValues(toScaled(left, ctx), toScaled(right, ctx));
}
