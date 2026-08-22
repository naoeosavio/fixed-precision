import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { greaterThanOrEqualValue } from "../../core/relational/greaterThanOrEqual";

export function greaterThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return greaterThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}
