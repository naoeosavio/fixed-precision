import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function idiv(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(value, other);
  return fromRawWithContext(
    (scaled.left / scaled.right) * scaled.ctx.SCALE,
    scaled.ctx,
  );
}
