import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function mod(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(value, amount);
  return fromRawWithContext(
    (scaled.left * scaled.ctx.SCALE) % scaled.right,
    scaled.ctx,
  );
}

export function modBy(amount: FixedPrecisionOperand) {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    mod(value, amount);
}
