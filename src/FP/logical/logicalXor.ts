import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { logicalXorValues } from "../../core/logical/logicalXor";

export function logicalXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalXorValues(toScaled(left, ctx), toScaled(right, ctx));
}
