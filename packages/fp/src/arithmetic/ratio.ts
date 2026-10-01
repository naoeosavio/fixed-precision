import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  toScaledPairRaw,
} from "../construction";

/**
 * Raw division of two operands, without rescaling.
 *
 * Unlike divide, performs no rescaling between operands: data operands
 * are combined as-is in the left operand's context with no compatibility
 * check, so callers must pass compatible contexts (same places).
 * Primitive sides are scaled into that context, falling back to the
 * default context when both operands are primitives. Shares the context
 * reference instead of cloning it, as contexts are immutable.
 *
 * @param value - Left operand, data or primitive.
 * @param amount - Right operand, data or primitive.
 * @returns Raw quotient (left / right, truncated, no SCALE adjustment) as
 * new fixed-precision data.
 */
export function ratio(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPairRaw(value, amount);
  // No rescaling between operands; the trusted context is shared.
  return { ctx: scaled.ctx, value: scaled.left / scaled.right };
}

/**
 * Creates a function that divides any operand by a fixed amount.
 *
 * @param amount - Right operand captured for later calls.
 * @returns Function applying raw division with the captured amount.
 */
export function ratioBy(
  amount: FixedPrecisionOperand,
): (value: FixedPrecisionOperand) => FixedPrecisionData {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    ratio(value, amount);
}
