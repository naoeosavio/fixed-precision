import { equalsValue } from "../../core/relational/equals";
import { type FixedPrecisionOperand, toScaledPairRaw } from "../construction";

/**
 * Raw equality of two operands, without rescaling.
 *
 * Unlike equals, performs no rescaling between operands: data operands
 * are combined as-is in the left operand's context with no compatibility
 * check, so callers must pass compatible contexts (same places).
 * Primitive sides are scaled into that context, falling back to the
 * default context when both operands are primitives.
 *
 * @param left - Left operand, data or primitive.
 * @param right - Right operand, data or primitive.
 * @returns Whether both operands hold the same raw value.
 */
export function eql(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPairRaw(left, right);
  // No data side, scale both operands into the default context.
  return equalsValue(scaled.left, scaled.right);
}
