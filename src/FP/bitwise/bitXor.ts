import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function bitXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([left, right]);
  return fromRawWithContext(toScaled(left, ctx) ^ toScaled(right, ctx), ctx);
}
