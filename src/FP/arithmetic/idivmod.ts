import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function idivmod(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): { quotient: FixedPrecisionData; remainder: FixedPrecisionData } {
  const scaled = toScaledPair(value, other);
  const quotientRaw = (scaled.left / scaled.right) * scaled.ctx.SCALE;

  return {
    quotient: fromRawWithContext(quotientRaw, scaled.ctx),
    remainder: fromRawWithContext(
      scaled.left - (quotientRaw * scaled.right) / scaled.ctx.SCALE,
      scaled.ctx,
    ),
  };
}
