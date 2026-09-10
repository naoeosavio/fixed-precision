import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function idiv(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): FixedPrecisionData {
  if (
    isFixedPrecisionData(value) &&
    isFixedPrecisionData(other) &&
    value.places === other.places &&
    value.roundingMode === other.roundingMode
  ) {
    return fromRawWithContext((value.value / other.value) * value.SCALE, value);
  }
  const ctx = resolveContextPair(value, other);
  return fromRawWithContext(
    (toScaled(value, ctx) / toScaled(other, ctx)) * ctx.SCALE,
    ctx,
  );
}
