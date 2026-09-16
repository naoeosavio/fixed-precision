import { greaterThanOrEqualValue } from "../../core/relational/greaterThanOrEqual";
import { type FixedPrecisionOperand, toScaledPairRaw } from "../construction";

/**
 * Raw greater-than-or-equal of two operands, without rescaling.
 *
 * Unlike greaterThanOrEqual, performs no rescaling between operands:
 * data operands are combined as-is in the left operand's context with
 * no compatibility check, so callers must pass compatible contexts
 * (same places). Primitive sides are scaled into that context, falling
 * back to the default context when both operands are primitives.
 *
 * @param left - Left operand, data or primitive.
 * @param right - Right operand, data or primitive.
 * @returns Whether the left raw value is at least the right one.
 */
export function gte(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPairRaw(left, right);
  // No data side, scale both operands into the default context.
  return greaterThanOrEqualValue(scaled.left, scaled.right);
}

/**
 * Creates a function that raw-tests any operand against a fixed lower bound.
 *
 * @param right - Right operand captured for later calls.
 * @returns Function applying raw greater-than-or-equal with the captured operand.
 */
export function gteBy(
  right: FixedPrecisionOperand,
): (left: FixedPrecisionOperand) => boolean {
  return (left: FixedPrecisionOperand): boolean => gte(left, right);
}
