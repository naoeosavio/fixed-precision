import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function multiply(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, amount]);
  return fromRawWithContext(
    (toScaled(value, ctx) * toScaled(amount, ctx)) / ctx.SCALE,
    ctx,
  );
}
