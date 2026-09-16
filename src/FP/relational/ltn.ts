import { lessThanValue } from "../../core/relational/lessThan";
import { type FixedPrecisionOperand, toScaledPairRaw } from "../construction";

/**
 * Raw less-than of two operands, without rescaling.
 *
 * Unlike lessThan, performs no rescaling between operands: data operands
 * are combined as-is in the left operand's context with no compatibility
 * check, so callers must pass compatible contexts (same places).
 * Primitive sides are scaled into that context, falling back to the
 * default context when both operands are primitives.
 *
 * @param left - Left operand, data or primitive.
 * @param right - Right operand, data or primitive.
 * @returns Whether the left raw value is less than the right one.
 */
export function ltn(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPairRaw(left, right);
  // No data side, scale both operands into the default context.
  return lessThanValue(scaled.left, scaled.right);
}

/**
 * Creates a function that raw-tests any operand as less than a fixed one.
 *
 * @param right - Right operand captured for later calls.
 * @returns Function applying raw less-than with the captured operand.
 */
export function ltnBy(
  right: FixedPrecisionOperand,
): (left: FixedPrecisionOperand) => boolean {
  return (left: FixedPrecisionOperand): boolean => ltn(left, right);
}
