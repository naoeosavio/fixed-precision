import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function subtract(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  if (
    isFixedPrecisionData(value) &&
    isFixedPrecisionData(amount) &&
    value.places === amount.places &&
    value.roundingMode === amount.roundingMode
  ) {
    return fromRawWithContext(value.value - amount.value, value);
  }
  const ctx = resolveContextPair(value, amount);
  return fromRawWithContext(toScaled(value, ctx) - toScaled(amount, ctx), ctx);
}
