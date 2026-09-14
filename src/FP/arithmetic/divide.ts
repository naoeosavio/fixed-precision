import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  isFixedPrecisionData,
  toScaledPair,
} from "../construction";

export function divide(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(value, amount);
  return fromRawWithContext(
    (scaled.left * scaled.ctx.SCALE) / scaled.right,
    scaled.ctx,
  );
}
