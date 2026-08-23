import { greaterThanValue } from "../../core/relational/greaterThan";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function greaterThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return greaterThanValue(toScaled(left, ctx), toScaled(right, ctx));
}
