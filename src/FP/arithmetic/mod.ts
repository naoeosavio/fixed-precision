import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function mod(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  if (
    isFixedPrecisionData(value) &&
    isFixedPrecisionData(amount) &&
    value.places === amount.places &&
    value.roundingMode === amount.roundingMode
  ) {
    return fromRawWithContext(
      (value.value * value.SCALE) % amount.value,
      value,
    );
  }
  const ctx = resolveContextPair(value, amount);
  return fromRawWithContext(
    (toScaled(value, ctx) * ctx.SCALE) % toScaled(amount, ctx),
    ctx,
  );
}
