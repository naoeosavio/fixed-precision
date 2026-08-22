import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { lessThanOrEqualValue } from "../../core/relational/lessThanOrEqual";

export function lessThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return lessThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}
