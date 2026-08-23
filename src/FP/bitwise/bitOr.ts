import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function bitOr(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([left, right]);
  return fromRawWithContext(toScaled(left, ctx) | toScaled(right, ctx), ctx);
}
