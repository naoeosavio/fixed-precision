import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function bitXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(left, right);
  return fromRawWithContext(scaled.left ^ scaled.right, scaled.ctx);
}

export function bitXorBy(right: FixedPrecisionOperand) {
  return (left: FixedPrecisionOperand): FixedPrecisionData =>
    bitXor(left, right);
}
