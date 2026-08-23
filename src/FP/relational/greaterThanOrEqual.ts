import { greaterThanOrEqualValue } from "../../core/relational/greaterThanOrEqual";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function greaterThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return greaterThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}
