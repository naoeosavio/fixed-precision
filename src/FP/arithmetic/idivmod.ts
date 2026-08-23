import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function idivmod(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): { quotient: FixedPrecisionData; remainder: FixedPrecisionData } {
  const ctx = resolveContext([value, other]);
  const raw = toScaled(value, ctx);
  const otherRaw = toScaled(other, ctx);
  const quotientRaw = (raw / otherRaw) * ctx.SCALE;

  return {
    quotient: fromRawWithContext(quotientRaw, ctx),
    remainder: fromRawWithContext(
      raw - (quotientRaw * otherRaw) / ctx.SCALE,
      ctx,
    ),
  };
}
