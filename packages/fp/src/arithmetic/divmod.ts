import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function divmod(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): { quotient: FixedPrecisionData; remainder: FixedPrecisionData } {
  const scaled = toScaledPair(value, other);
  const quotientRaw = (scaled.left * scaled.ctx.SCALE) / scaled.right;

  return {
    quotient: fromRawWithContext(quotientRaw, scaled.ctx),
    remainder: fromRawWithContext(
      scaled.left - (quotientRaw * scaled.right) / scaled.ctx.SCALE,
      scaled.ctx,
    ),
  };
}

export function divmodBy(other: FixedPrecisionOperand) {
  return (
    value: FixedPrecisionOperand,
  ): { quotient: FixedPrecisionData; remainder: FixedPrecisionData } =>
    divmod(value, other);
}
