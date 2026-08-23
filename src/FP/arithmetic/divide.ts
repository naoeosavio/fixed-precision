import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function divide(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, amount]);
  return fromRawWithContext(
    (toScaled(value, ctx) * ctx.SCALE) / toScaled(amount, ctx),
    ctx,
  );
}
