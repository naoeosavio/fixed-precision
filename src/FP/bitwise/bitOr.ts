import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function bitOr(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(left, right);
  return fromRawWithContext(scaled.left | scaled.right, scaled.ctx);
}
