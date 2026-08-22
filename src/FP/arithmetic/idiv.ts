import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function idiv(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, other]);
  return fromRawWithContext(
    (toScaled(value, ctx) / toScaled(other, ctx)) * ctx.SCALE,
    ctx,
  );
}
