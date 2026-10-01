import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function add(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(value, amount);
  return fromRawWithContext(scaled.left + scaled.right, scaled.ctx);
}

export function addBy(amount: FixedPrecisionOperand) {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    add(value, amount);
}
