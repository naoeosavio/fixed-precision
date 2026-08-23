import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function idiv(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, other]);
  return fromRawWithContext(
    (toScaled(value, ctx) / toScaled(other, ctx)) * ctx.SCALE,
    ctx,
  );
}
