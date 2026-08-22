import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { lessThanValue } from "../../core/relational/lessThan";

export function lessThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return lessThanValue(toScaled(left, ctx), toScaled(right, ctx));
}
