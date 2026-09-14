import { lessThanOrEqualValue } from "../../core/relational/lessThanOrEqual";
import { type FixedPrecisionOperand, toScaledPairRaw } from "../construction";

/**
 * Raw less-than-or-equal of two operands, without rescaling.
 *
 * Unlike lessThanOrEqual, performs no rescaling between operands: data
 * operands are combined as-is in the left operand's context with no
 * compatibility check, so callers must pass compatible contexts (same
 * places). Primitive sides are scaled into that context, falling back
 * to the default context when both operands are primitives.
 *
 * @param left - Left operand, data or primitive.
 * @param right - Right operand, data or primitive.
 * @returns Whether the left raw value is at most the right one.
 */
export function lte(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const scaled = toScaledPairRaw(left, right);
  // No data side, scale both operands into the default context.
  return lessThanOrEqualValue(scaled.left, scaled.right);
}

