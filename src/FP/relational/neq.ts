import type { FixedPrecisionOperand } from "../construction";
import { eql } from "./eql";

/**
 * Raw inequality of two operands, without rescaling.
 *
 * Inverse of eql: performs no rescaling between operands, callers must
 * pass compatible contexts (same places).
 *
 * @param left - Left operand, data or primitive.
 * @param right - Right operand, data or primitive.
 * @returns Whether the operands hold different raw values.
 */
export function neq(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  return !eql(left, right);
}
