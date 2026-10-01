import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
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

export function divideBy(amount: FixedPrecisionOperand) {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    divide(value, amount);
}
