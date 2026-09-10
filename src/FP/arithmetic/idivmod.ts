import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  type FPContext,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function idivmod(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): { quotient: FixedPrecisionData; remainder: FixedPrecisionData } {
  let ctx: FPContext;
  let raw: bigint;
  let otherRaw: bigint;
  if (
    isFixedPrecisionData(value) &&
    isFixedPrecisionData(other) &&
    value.places === other.places &&
    value.roundingMode === other.roundingMode
  ) {
    ctx = value;
    raw = value.value;
    otherRaw = other.value;
  } else {
    ctx = resolveContextPair(value, other);
    raw = toScaled(value, ctx);
    otherRaw = toScaled(other, ctx);
  }
  const quotientRaw = (raw / otherRaw) * ctx.SCALE;

  return {
    quotient: fromRawWithContext(quotientRaw, ctx),
    remainder: fromRawWithContext(
      raw - (quotientRaw * otherRaw) / ctx.SCALE,
      ctx,
    ),
  };
}
