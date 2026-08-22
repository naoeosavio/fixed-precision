import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { greaterThanValue } from "../../core/relational/greaterThan";

export function greaterThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return greaterThanValue(toScaled(left, ctx), toScaled(right, ctx));
}
