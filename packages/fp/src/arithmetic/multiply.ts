import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function multiply(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(value, amount);
  return fromRawWithContext(
    (scaled.left * scaled.right) / scaled.ctx.SCALE,
    scaled.ctx,
  );
}

export function multiplyBy(amount: FixedPrecisionOperand) {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    multiply(value, amount);
}
