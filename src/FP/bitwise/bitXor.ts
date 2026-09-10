import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function bitXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): FixedPrecisionData {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return fromRawWithContext(left.value ^ right.value, left);
  }
  const ctx = resolveContextPair(left, right);
  return fromRawWithContext(toScaled(left, ctx) ^ toScaled(right, ctx), ctx);
}
