import { compareValues } from "../../core/relational/compare";
import {
  type Comparison,
  type FixedPrecisionOperand,
  toScaledPairRaw,
} from "../construction";

/**
 * Raw comparison of two operands, without rescaling.
 *
 * Unlike compare, performs no rescaling between operands: data operands
 * are combined as-is in the left operand's context with no compatibility
 * check, so callers must pass compatible contexts (same places).
 * Primitive sides are scaled into that context, falling back to the
 * default context when both operands are primitives.
 *
 * @param value - Left operand, data or primitive.
 * @param other - Right operand, data or primitive.
 * @returns -1, 0, or 1 as value is less than, equal to, or greater.
 */
export function cmp(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): Comparison {
  const scaled = toScaledPairRaw(value, other);
  // No data side, scale both operands into the default context.
  return compareValues(scaled.left, scaled.right);
}

/**
 * Creates a function that raw-compares any operand against a fixed one.
 *
 * @param other - Right operand captured for later calls.
 * @returns Function applying raw comparison with the captured operand.
 */
export function cmpBy(
  other: FixedPrecisionOperand,
): (value: FixedPrecisionOperand) => Comparison {
  return (value: FixedPrecisionOperand): Comparison => cmp(value, other);
}
