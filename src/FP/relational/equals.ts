import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { equalsValue } from "../../core/relational/equals";

export function equals(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return equalsValue(toScaled(left, ctx), toScaled(right, ctx));
}
