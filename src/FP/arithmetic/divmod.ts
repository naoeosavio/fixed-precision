import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function divmod(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): { quotient: FixedPrecisionData; remainder: FixedPrecisionData } {
  const ctx = resolveContext([value, other]);
  const raw = toScaled(value, ctx);
  const otherRaw = toScaled(other, ctx);
  const quotientRaw = (raw * ctx.SCALE) / otherRaw;

  return {
    quotient: fromRawWithContext(quotientRaw, ctx),
    remainder: fromRawWithContext(
      raw - (quotientRaw * otherRaw) / ctx.SCALE,
      ctx,
    ),
  };
}
