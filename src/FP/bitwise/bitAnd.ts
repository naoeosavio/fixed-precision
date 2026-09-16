import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function bitAnd(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(left, right);
  return fromRawWithContext(scaled.left & scaled.right, scaled.ctx);
}

export function bitAndBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): FixedPrecisionData =>
    bitAnd(left, right);
}
